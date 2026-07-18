import json
from groq import Groq
from core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY, timeout=15.0)

def generate_scorecard(resume_text: str, jd_text: str, role: str) -> dict:
    """Uses LLaMA 3 70b via Groq to deeply analyze the resume against the JD."""
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
    Analyze the following resume against the given Job Description for the role of '{role}'.
    
    JOB DESCRIPTION:
    {jd_text[:4000]}
    
    RESUME:
    {resume_text[:5000]}
    
    Return a STRICT JSON object containing the exact following structure. Do not output any other markdown or text.
    {{
        "resume_summary": [
            {{ "section_name": "(e.g., Professional Summary, Experience, Education, Skills, Key Achievements)", "content": "(A detailed summary of everything in this section. For the Education section, you MUST explicitly include all grades, GPA, and percentages for intermediate, matriculation, and degrees. Ensure you explicitly include sections for Skills and Key Achievements if present.)" }}
        ],
        "overall_feedback": "(A brief, highly actionable 2-sentence summary of how well they fit)",
        "section_feedbacks": {{
            "summary": "(1 sentence actionable tip)",
            "experience": "(1 sentence actionable tip)",
            "education": "(1 sentence actionable tip)",
            "skills": "(1 sentence actionable tip)"
        }},
        "missing_skills": [ "(array of critical skills present in the JD that are NOT found in the resume)" ],
        "matched_skills": [ "(array of skills present in both JD and resume)" ],
        "all_extracted_skills": [ "(array of ALL hard and soft skills, technologies, languages, tools, and frameworks found anywhere in the resume. There is NO LIMIT. You MUST extract every single skill mentioned in the tech stack, Experience, and Projects sections, not just the Skills section. DO NOT SKIP ANY.)" ],
        "actionable_suggestions": [
            "(Suggestion 1: What to add to skills)",
            "(Suggestion 2: How to improve experience bullet points)",
            "(Suggestion 3: Structural improvement)"
        ]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a world-class ATS Resume Analyzer. Always output raw JSON only, without ```json markdown wrappers."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        llm_data = json.loads(result)
        
        # Apply custom programmatic evaluation framework
        return calculate_custom_score(llm_data)
    except Exception as e:
        print(f"LLM API Error: {str(e)}")
        # Fallback empty structure
        return {
            "resume_summary": [
                { "section_name": "Error", "content": "Analysis failed to generate a summary." }
            ],
            "match_percentage": 50,
            "overall_feedback": "Failed to generate AI analysis.",
            "section_scores": {
                "summary": {"score": 0, "feedback": ""},
                "experience": {"score": 0, "feedback": ""},
                "education": {"score": 0, "feedback": ""},
                "skills": {"score": 0, "feedback": ""}
            },
            "missing_skills": [],
            "matched_skills": [],
            "all_extracted_skills": [],
            "actionable_suggestions": []
        }

def calculate_custom_score(llm_data: dict) -> dict:
    """
    Implements a custom evaluation framework to score the resume based on the extracted data,
    satisfying the requirement to avoid relying entirely on external AI for the scoring logic.
    """
    matched = llm_data.get("matched_skills", [])
    missing = llm_data.get("missing_skills", [])
    all_skills = llm_data.get("all_extracted_skills", [])
    
    # 0. Anti-Hallucination Filter: Ensure no 'missing' skill is actually in the extracted skills
    real_missing = []
    all_skills_lower = [s.lower() for s in all_skills]
    
    for m in missing:
        m_lower = m.lower()
        is_actually_found = False
        for ext in all_skills_lower:
            if m_lower == ext or (len(ext) > 3 and ext in m_lower) or (len(m_lower) > 3 and m_lower in ext):
                is_actually_found = True
                break
                
        if is_actually_found:
            # Move to matched if not already there
            if not any(m.lower() == match.lower() for match in matched):
                matched.append(m)
        else:
            real_missing.append(m)
            
    missing = real_missing
    llm_data["missing_skills"] = missing
    llm_data["matched_skills"] = matched
    
    summary_sections = llm_data.get("resume_summary", [])
    if isinstance(summary_sections, list):
        summary_sections = [s for s in summary_sections if isinstance(s, dict)]
    else:
        summary_sections = []
    
    # 1. Overall ATS Score Calculation
    
    # A. Skill Match Ratio (Weight: 50%)
    total_jd_skills = len(matched) + len(missing)
    skill_ratio = len(matched) / total_jd_skills if total_jd_skills > 0 else 0
    skill_score = skill_ratio * 50
    
    # B. Keyword Density & Depth (Weight: 25%)
    # Max score if they have 15 or more total extracted skills
    depth_score = min(25, (len(all_skills) / 15) * 25)
    
    # C. Section Completeness (Weight: 25%)
    # Look for common critical sections
    section_names = [s.get("section_name", "").lower() for s in summary_sections]
    has_experience = any("experience" in name or "work" in name for name in section_names)
    has_education = any("education" in name or "degree" in name or "university" in name for name in section_names)
    has_skills = any("skill" in name or "technolog" in name for name in section_names)
    has_projects = any("project" in name for name in section_names)
    
    completeness = 0
    if has_experience: completeness += 10
    if has_education: completeness += 5
    if has_skills: completeness += 5
    if has_projects: completeness += 5
    
    overall_score = round(skill_score + depth_score + completeness)
    
    # 2. Section Scores Calculation
    section_scores = {}
    section_feedbacks = llm_data.get("section_feedbacks", {})
    
    # Experience
    # Experience score heavily tied to matched keywords, max realistic score ~95
    exp_score = min(95, 40 + (skill_ratio * 40) + (depth_score * 0.6)) if has_experience else 0
    section_scores["experience"] = {
        "score": round(exp_score),
        "feedback": section_feedbacks.get("experience", "Add more quantifiable metrics to your experience.")
    }
    
    # Education
    edu_content = next((s.get("content", "").lower() for s in summary_sections if "education" in s.get("section_name", "").lower()), "")
    edu_score = 0
    if has_education:
        edu_score = 70
        if any(w in edu_content for w in ["bachelor", "b.s", "b.tech", "degree", "b.a", "bsc"]):
            edu_score += 15
        if any(w in edu_content for w in ["master", "m.s", "phd", "m.tech", "msc"]):
            edu_score += 10
        edu_score = min(96, edu_score)

    section_scores["education"] = {
        "score": round(edu_score),
        "feedback": section_feedbacks.get("education", "Ensure your degree and graduation date are clear.")
    }
    
    # Skills
    skills_score = min(98, (len(matched) / total_jd_skills * 100)) if total_jd_skills > 0 else (85 if has_skills else 0)
    section_scores["skills"] = {
        "score": round(skills_score),
        "feedback": section_feedbacks.get("skills", "Group your skills by category (e.g., Languages, Frameworks).")
    }
    
    # Summary
    has_summary = any("summary" in name or "objective" in name or "profile" in name for name in section_names)
    sum_score = min(92, 50 + (overall_score * 0.45)) if has_summary else 0
    section_scores["summary"] = {
        "score": round(sum_score),
        "feedback": section_feedbacks.get("summary", "Include a strong professional summary highlighting your top achievements.")
    }
    
    # Build final result
    llm_data["match_percentage"] = overall_score
    llm_data["section_scores"] = section_scores
    
    # Clean up intermediate fields if needed
    if "section_feedbacks" in llm_data:
        del llm_data["section_feedbacks"]
        
    return llm_data

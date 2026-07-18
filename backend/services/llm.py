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
            {{ "section_name": "(e.g., Professional Summary, Experience, Education, Projects)", "content": "(A detailed summary of everything in this section)" }}
        ],
        "overall_feedback": "(A brief, highly actionable 2-sentence summary of how well they fit)",
        "section_feedbacks": {{
            "summary": "(1 sentence actionable tip)",
            "experience": "(1 sentence actionable tip)",
            "education": "(1 sentence actionable tip)",
            "skills": "(1 sentence actionable tip)"
        }},
        "missing_skills": [ "(array of 3-5 critical hard skills missing from resume but present in JD)" ],
        "matched_skills": [ "(array of 5-10 critical skills present in both)" ],
        "all_extracted_skills": [ "(array of ALL notable hard and soft skills found anywhere in the resume, no limit)" ],
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
    exp_content = next((s.get("content", "") for s in summary_sections if "experience" in s.get("section_name", "").lower()), "")
    exp_score = min(100, (len(exp_content) / 200) * 100) if has_experience else 0
    section_scores["experience"] = {
        "score": round(exp_score),
        "feedback": section_feedbacks.get("experience", "Add more quantifiable metrics to your experience.")
    }
    
    # Education
    section_scores["education"] = {
        "score": 100 if has_education else 0,
        "feedback": section_feedbacks.get("education", "Ensure your degree and graduation date are clear.")
    }
    
    # Skills
    skills_score = min(100, (len(all_skills) / 10) * 100)
    section_scores["skills"] = {
        "score": round(skills_score),
        "feedback": section_feedbacks.get("skills", "Group your skills by category (e.g., Languages, Frameworks).")
    }
    
    # Summary
    has_summary = any("summary" in name or "objective" in name or "profile" in name for name in section_names)
    summary_content = next((s.get("content", "") for s in summary_sections if "summary" in s.get("section_name", "").lower()), "")
    sum_score = min(100, (len(summary_content) / 100) * 100) if has_summary else 0
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

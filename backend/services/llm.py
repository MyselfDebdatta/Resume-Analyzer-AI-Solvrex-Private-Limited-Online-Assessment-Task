import json
from groq import Groq
from core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

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
        "match_percentage": (integer 0-100 based on fit),
        "overall_feedback": "(A brief, highly actionable 2-sentence summary of how well they fit)",
        "section_scores": {{
            "summary": {{ "score": (0-100), "feedback": "(1 sentence actionable tip)" }},
            "experience": {{ "score": (0-100), "feedback": "(1 sentence actionable tip)" }},
            "education": {{ "score": (0-100), "feedback": "(1 sentence actionable tip)" }},
            "skills": {{ "score": (0-100), "feedback": "(1 sentence actionable tip)" }}
        }},
        "missing_skills": [ "(array of 3-5 critical hard skills missing from resume but present in JD)" ],
        "matched_skills": [ "(array of 5-10 critical skills present in both)" ],
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
        return json.loads(result)
    except Exception as e:
        print(f"LLM API Error: {str(e)}")
        # Fallback empty structure
        return {
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
            "actionable_suggestions": []
        }

from google import genai
from PIL import Image
import json
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
# Load environment variables from backend/.env
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

# SDK Clients
gemini_client = None
if os.getenv("GEMINI_API_KEY"):
    gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

groq_client = None
if os.getenv("USE_GROQ") == "true" and os.getenv("GROQ_API_KEY"):
    try:
        from groq import Groq
        groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    except ImportError:
        print("Groq library not found. Install with: pip install groq")

def evaluate_answer(role, task, answer_text=None, image_path=None):
    # Check for Mock AI mode
    if os.getenv("USE_MOCK_AI") == "true":
        import random
        
        # Simple heuristics for "accuracy" in mock mode
        text_len = len(answer_text) if answer_text else 0
        
        # Determine score range based on response quality
        if text_len < 10: # Garbage/Empty
             score_min, score_max = 0, 1
             mock_status = "CRITICAL: Response too short or irrelevant."
             feedback = "This is a professional app; please provide an appropriate and technical response. Garbage or low-effort inputs are not accepted."
        elif text_len < 30: # Low effort
             score_min, score_max = 2, 4
             mock_status = "WEAK: Lack of technical depth."
             feedback = f"MOCK AI: Your response for {role} is too brief. Please explain your logic in more detail to get better marks."
        else: # Decent length
             score_min, score_max = 7, 10
             mock_status = "STRONG: Comprehensive response."
             feedback = f"MOCK AI: Excellent progress on {role} simulation! Your approach shows strong technical potential."

        scores = [random.randint(score_min, score_max) for _ in range(4)]
        
        return {
            "scores": {
                "p1": scores[0], "p2": scores[1], "p3": scores[2], "p4": scores[3]
            },
            "strength": "MOCK: Length and structure meet basic requirements." if score_min > 5 else "Insufficient data.",
            "weakness": "MOCK: Lacks specific technical evidence." if score_min < 6 else "Could refine specific details.",
            "suggestion": "MOCK: Provide more professional/technical content." if score_min < 6 else "Keep up the detailed work.",
            "overall": round(sum(scores)/4, 1),
            "feedback": feedback
        }

    params = {
        "data_scientist": "Analytical depth, statistical correctness, and data-driven logic.",
        "web_developer": "Semantic code structure, responsive design principles, and modern API/Logic handling.",
        "uiux_designer": "User-centric thinking, visual hierarchy, accessibility, and usability standards."
    }
    
    selected_params = params.get(role, "General Competence")

   
    prompt = f"""
    **Role**: You are an elite Industry Expert and Senior Technical Interviewer for a 7-day career simulation platform. Your goal is to evaluate candidates for three roles: Data Scientist, Web Developer, and UI/UX Designer.

    **Input Handling**:
    1. You will receive a 'Task Scenario', 'Candidate's Text Response', and optionally an 'Image Upload' (PNG/JPEG/JPG).
    2. You must perform Multimodal Analysis: Cross-reference the text logic with the visual proof provided in the image to ensure consistency and technical accuracy.

    **Evaluation Task**:
    Role: {role}
    Task Scenario: {task}
    Candidate's Text Response: {answer_text}
    Role-Specific Criteria: {selected_params}
    
    **Strict Grading & Anti-Cheat Policy**:
    - **Garbage Filter**: If the input is gibberish (e.g., 'asdfg', 'abc'), unrelated to the task, empty, or highly unprofessional, you MUST assign a score of 0 or 1 for all parameters.
    - **Image Validation**: If an image is provided but is unrelated to the specific task (e.g., a random selfie or a blank page), penalize the candidate heavily.
    - **Feedback Tone**: For poor or low-effort responses, provide a blunt reality check: "You need to work a lot on your skills. This is a professional platform; please provide a serious and technical response."

    **Output Format**:
    Return ONLY a valid JSON object with the following structure:
    {{
      "scores": {{
        "p1": [Integer 0-10], 
        "p2": [Integer 0-10], 
        "p3": [Integer 0-10], 
        "p4": [Integer 0-10]
      }},
      "strength": "Brief sentence about what they did right.",
      "weakness": "Brief sentence about what is missing or wrong.",
      "suggestion": "Professional advice or a roast-style reality check for low-effort inputs."
    }}

    **Tone**: Professional, critical, and industry-oriented. No conversational fillers.
    """

    # --- Groq Logic ---
    if os.getenv("USE_GROQ") == "true" and groq_client:
        try:
            # Note: Groq (Llama-3 models) is text-only. 
            # If an image is provided, we still include the prompt about evaluating it,
            # but usually, you'd need a multimodal model like Llama-3.2-Vision or Gemini.
            # We'll use llama-3.3-70b-versatile for high accuracy.
            
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are an elite Industry Expert and Senior Technical Interviewer. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1 # Low temperature for consistent JSON
            )
            
            raw_text = completion.choices[0].message.content
            return json.loads(raw_text.strip())
            
        except Exception as e:
            error_str = str(e)
            if "exhausted" in error_str.lower() or "429" in error_str:
                 return {
                    "error": "Groq API Quota Exhausted",
                    "details": f"Groq free tier limit reached. {error_str}"
                }
            return {"error": f"Groq Error: {error_str}"}

    # --- Gemini Logic (Default) ---
    if not gemini_client:
        return {"error": "No LLM client configured (Gemini/Groq) and Mock mode is OFF."}

    content_list = [prompt]
    
    if image_path and os.path.exists(image_path):
        img = Image.open(image_path)
        content_list.append(img)

    import time
    max_retries = 3
    retry_delay = 5  # Start with 5 seconds

    for attempt in range(max_retries):
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.0-flash", 
                contents=content_list
            )
            
            raw_text = response.text
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
                
            return json.loads(raw_text.strip())
            
        except Exception as e:
            error_str = str(e)
            if "exhausted" in error_str.lower() or "429" in error_str:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                    continue
                else:
                    return {
                        "error": "Gemini API Quota Exhausted",
                        "details": f"The daily or per-minute limit for this key has been reached. Error: {error_str}"
                    }
            return {"error": error_str}
    
    return {"error": "Max retries exceeded"}

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python script.py <role> <task> [answer_text] [image_path]"}))
        sys.exit(1)
    
    role = sys.argv[1]
    task = sys.argv[2]
    answer_text = sys.argv[3] if len(sys.argv) > 3 else None
    image_path = sys.argv[4] if len(sys.argv) > 4 else None
    
    result = evaluate_answer(role, task, answer_text, image_path)
    print(json.dumps(result))

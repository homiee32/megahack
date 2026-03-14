from google import genai
from PIL import Image
import json
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
# dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
# load_dotenv(dotenv_path)

client = genai.Client(api_key="AIzaSyB4l1aOTL1ganRazAFbgfIhrCG0f9Uyzek")

def evaluate_answer(role, task, answer_text=None, image_path=None):
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

    content_list = [prompt]
    
   
    if image_path and os.path.exists(image_path):
        img = Image.open(image_path)
        content_list.append(img)

    import time
    max_retries = 3
    retry_delay = 5  # Start with 5 seconds

    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model="gemini-1.5-flash", # Switching to 1.5-flash for potentially better quota limits
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
                        "details": f"You have reached the daily/minute limit for this key. Model used: gemini-1.5-flash. Error: {error_str}"
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

import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Try to load .env from the project root
# Current file: backend/src/app/services/ai.py
# Project root is 4 levels up: /
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
load_dotenv(os.path.join(project_root, ".env"))

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

MODEL = "openai/gpt-oss-120b:free"

SYSTEM_PROMPT = """You are an intelligent Kanban Project Management AI Assistant.
The user is viewing their Kanban board. You will receive their message and the current state of their board in JSON format.
Your job is to reply to the user, and if they ask to modify the board (e.g. add a card, rename a column, delete a card, move a card), you must output the completely updated board JSON.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "reply": "Your friendly, conversational response explaining what you did.",
  "board_update": { 
     // Include the ENTIRE updated board object here (columns array and cards object) IF changes were made.
     // If NO changes were requested or made, this should be null.
  }
}
Ensure your output is parsable JSON.
"""

def generate_chat_response(prompt: str, board_state: dict) -> dict:
    if not OPENROUTER_API_KEY:
        return {"reply": "Error: OPENROUTER_API_KEY is not set.", "board_update": None}
        
    try:
        completion = client.chat.completions.create(
            model=MODEL,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"CURRENT BOARD STATE:\n{json.dumps(board_state)}\n\nUSER MESSAGE:\n{prompt}"}
            ],
            extra_headers={
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "Kanban Studio",
            }
        )
        content = completion.choices[0].message.content
        if not content:
            return {"reply": "No response from AI.", "board_update": None}
        return json.loads(content)
    except Exception as e:
        return {"reply": f"Error communicating with AI: {str(e)}", "board_update": None}

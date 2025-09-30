# app_chat.py (merged)
import os, requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv(dotenv_path=".env")
load_dotenv()
app = Flask(__name__)

# Allow the Vite dev origin
CORS(app, resources={r"/chat": {"origins": [
    "http://localhost:5173", "http://127.0.0.1:5173"
]}})

@app.after_request
def add_cors(resp):
    origin = request.headers.get("Origin")
    if origin in {"http://localhost:5173","http://127.0.0.1:5173"}:
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Vary"] = "Origin"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY","")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL","https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL","openai/gpt-4o-mini")

@app.route("/chat", methods=["POST","OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return ("", 204)

    if not OPENROUTER_API_KEY:
        return jsonify({"ok": False, "error": "OPENROUTER_API_KEY missing"}), 500

    data = request.get_json(silent=True) or {}
    user_msg = (data.get("message") or "").strip()
    role = (data.get("role") or "farmer").strip().lower()
    if not user_msg:
        return jsonify({"ok": False, "error": "message is required"}), 400

    # IMPROVED SYSTEM PROMPT FOR BETTER FORMATTING
    system_prompt = (
        "Act as an agriculture assistant for Indian contexts. "
        "Format your response with clear structure: "
        "1. Start with a brief direct answer "
        "2. Use **bold** for important terms like crop names and chemicals "
        "3. Use numbered points (1., 2., 3.) for steps "
        "4. Keep responses concise and practical "
        "Include safety notes for chemicals and mention consulting local experts when needed. "
        f"User role: {role}"
    )

    url = f"{OPENROUTER_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "FarmchainX AI Assistant",
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_msg},
        ],
        "temperature": 0.2,
    }

    r = requests.post(url, json=payload, headers=headers, timeout=60)
    if r.status_code != 200:
        return jsonify({"ok": False, "error": f"Provider error: {r.text}"}), 502

    j = r.json()
    reply = j["choices"][0]["message"]["content"]
    return jsonify({"ok": True, "reply": reply})

if __name__ == "__main__":
    # use 127.0.0.1 to match the URL the frontend calls
    app.run(host="127.0.0.1", port=5000, debug=True)

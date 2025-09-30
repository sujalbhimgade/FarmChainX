import os
import requests
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# ==== Config ====
# Frontend origin (Vite dev)
FRONTEND_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

# OpenRouter (chat) config
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

# Roboflow (ripeness) config
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "").strip()
ROBOFLOW_MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID", "fruit-ripeness-f8ptq/1")

# ==== App ====
app = Flask(__name__)

# CORS for all relevant endpoints
CORS(app, resources={
    r"/chat": {
        "origins": FRONTEND_ORIGINS,
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Title", "HTTP-Referer"]
    },
    r"/crop-health": {
        "origins": FRONTEND_ORIGINS,
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    },
    r"/api/*": {
        "origins": FRONTEND_ORIGINS,
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ==== Health ====
@app.get("/health")
def health():
    return {"status": "ok"}, 200

# ==== CORS preflight helpers ====
def _preflight_ok():
    origin = request.headers.get("Origin", FRONTEND_ORIGINS[0])
    resp = make_response("", 204)
    resp.headers["Access-Control-Allow-Origin"] = origin
    resp.headers["Vary"] = "Origin"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = request.headers.get(
        "Access-Control-Request-Headers",
        "Content-Type, Authorization, X-Title, HTTP-Referer"
    )
    return resp

@app.route("/chat", methods=["OPTIONS"])
def chat_options():
    return _preflight_ok()

@app.route("/crop-health", methods=["OPTIONS"])
def crop_health_options():
    return _preflight_ok()

@app.route("/api/ai/ripeness", methods=["OPTIONS"])
def ripeness_options():
    return _preflight_ok()

# ==== Chat endpoint (OpenRouter proxy) ====
@app.route("/chat", methods=["POST","OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return make_response("", 204)

    data = request.get_json(silent=True) or {}
    user_msg = (data.get("message") or "").strip()
    if not user_msg:
        return jsonify(error={"message": "message is required"}), 400

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "FarmchainX",
    }
    payload = {
        "model": OPENROUTER_MODEL,                # e.g. "openai/gpt-4o-mini"
        "messages": [{"role": "user", "content": user_msg}],
    }

    r = requests.post(f"{OPENROUTER_BASE_URL}/chat/completions",
                      headers=headers, json=payload, timeout=60)

    if not r.ok:
        try:
            err = r.json()
        except Exception:
            err = {"message": r.text}
        # Surface provider error to the client
        return jsonify(ok=False, error={"message": f"Provider error: {err.get('error',{}).get('message') or err.get('message') or r.reason}"}), 502

    out = r.json()
    reply = (
        out.get("choices", [{}])[0].get("message", {}).get("content")
        or out.get("message", {}).get("content")
        or out.get("text")
        or "OK"
    )
    return jsonify(ok=True, reply=reply), 200

# ==== Ripeness / crop health core function ====
def _run_ripeness_inference(file_storage):
    """
    Accepts a Werkzeug FileStorage (from request.files['image' or 'file'])
    Runs Roboflow serverless inference, returns summary + raw predictions.
    """
    # Lazy imports so the app starts even if libs are missing (you'll need Pillow + inference-sdk installed)
    from PIL import Image
    from inference_sdk import InferenceHTTPClient, InferenceConfiguration

    if not ROBOFLOW_API_KEY:
        return {"error": "ROBOFLOW_API_KEY missing on server"}, 500

    img = Image.open(file_storage.stream).convert("RGB")

    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=ROBOFLOW_API_KEY,
    )
    config = InferenceConfiguration(
        confidence_threshold=0.30,
        iou_threshold=0.50,
    )

    with client.use_configuration(config):
        result = client.infer(img, model_id=ROBOFLOW_MODEL_ID)

    # Build a simple summary
    summary = {"ripe": 0, "unripe": 0, "overripe": 0}
    for p in result.get("predictions", []):
        cls = (p.get("class") or "").lower()
        if "unripe" in cls:
            summary["unripe"] += 1
        elif "overripe" in cls or "over-ripe" in cls:
            summary["overripe"] += 1
        elif "ripe" in cls:
            summary["ripe"] += 1

    return {"model_id": ROBOFLOW_MODEL_ID, "summary": summary, "raw": result}, 200

# Primary route used by your UI
@app.route("/crop-health", methods=["POST"])
def crop_health():
    try:
        storage = request.files.get("image") or request.files.get("file")
        if storage is None:
            return jsonify({"error": "form-data file missing. Use field 'image' (or 'file')."}), 400

        data, status = _run_ripeness_inference(storage)
        if status != 200:
            return jsonify(data), status
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Alias route to avoid 404 if UI still calls /api/ai/ripeness
@app.route("/api/ai/ripeness", methods=["POST"])
def ripeness_alias():
    return crop_health()

# ==== Main ====
if __name__ == "__main__":
    # Keep this on port 5000 to match the frontend config
    app.run(host="0.0.0.0", port=5000, debug=True)

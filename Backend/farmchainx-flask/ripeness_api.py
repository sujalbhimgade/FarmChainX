import os
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env (optional but recommended)
load_dotenv()

# Read config
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID") or "fruit-ripeness-f8ptq/1"

app = Flask(__name__)

# Enable CORS for Vite dev server
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

@app.get("/health")
def health():
    return {"status": "ok"}, 200

# Explicit preflight (OPTIONS) handler
@app.options("/api/ai/ripeness")
def ripeness_options():
    resp = make_response("", 204)
    origin = request.headers.get("Origin", "http://localhost:5173")
    resp.headers["Access-Control-Allow-Origin"] = origin
    resp.headers["Vary"] = "Origin"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return resp

@app.post("/api/ai/ripeness")
def ripeness():
    """
    Accepts multipart/form-data with field 'image' (or 'file').
    If ROBOFLOW_API_KEY is missing, returns a clear error without crashing the server.
    """
    try:
        storage = request.files.get("image") or request.files.get("file")
        if storage is None:
            return {"error": "form-data file missing. Use field name 'image' (or 'file')."}, 400

        # Lazy imports so the server can start even if libs are not installed yet
        from PIL import Image
        from inference_sdk import InferenceHTTPClient, InferenceConfiguration

        if not ROBOFLOW_API_KEY:
            return {"error": "ROBOFLOW_API_KEY not set in environment (.env)."}, 500

        pil_img = Image.open(storage.stream).convert("RGB")

        client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key=ROBOFLOW_API_KEY,
        )
        config = InferenceConfiguration(
            confidence_threshold=0.30,
            iou_threshold=0.50,
        )

        # Run inference
        with client.use_configuration(config):
            result = client.infer(pil_img, model_id=MODEL_ID)

        # Summarize detections
        summary = {"ripe": 0, "unripe": 0, "overripe": 0}
        for p in result.get("predictions", []):
            cls = (p.get("class") or "").lower()
            if "unripe" in cls:
                summary["unripe"] += 1
            elif "overripe" in cls or "over-ripe" in cls:
                summary["overripe"] += 1
            elif "ripe" in cls:
                summary["ripe"] += 1

        return jsonify({"model_id": MODEL_ID, "summary": summary, "raw": result}), 200

    except Exception as e:
        # Never crash the server on exceptions; return a JSON error
        return {"error": str(e)}, 500

if __name__ == "__main__":
    # Use a fixed port (5000) to match your frontend config
    app.run(host="0.0.0.0", port=5000, debug=True)

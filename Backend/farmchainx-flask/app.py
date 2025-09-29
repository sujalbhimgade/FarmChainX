import os
import math
import json
import base64
from io import BytesIO
from datetime import datetime
from urllib.parse import urlencode

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- ENV / CONFIG ---
# Chat / LLM
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

# Roboflow Hosted API
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")
ROBOFLOW_MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID", "")  # e.g., "your-project/1"
ROBOFLOW_API_URL = os.getenv("ROBOFLOW_API_URL", "https://detect.roboflow.com")

# Sentinel Hub Statistical API
SH_CLIENT_ID = os.getenv("SH_CLIENT_ID", "")
SH_CLIENT_SECRET = os.getenv("SH_CLIENT_SECRET", "")
SH_STAT_API = os.getenv("SH_STAT_API", "https://services.sentinel-hub.com/api/v1/statistical")

# Open-Meteo
OPEN_METEO_URL = os.getenv("OPEN_METEO_URL", "https://api.open-meteo.com/v1/forecast")


# --- Helpers ---
def error(msg, code=400):
    return jsonify({"ok": False, "error": msg}), code


def get_sentinalhub_token():
    """
    Get OAuth token from Sentinel Hub auth server.
    """
    token_url = "https://services.sentinel-hub.com/oauth/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": SH_CLIENT_ID,
        "client_secret": SH_CLIENT_SECRET,
    }
    resp = requests.post(token_url, data=data, timeout=30)
    if resp.status_code != 200:
        raise RuntimeError(f"Sentinel Hub auth failed: {resp.text}")
    return resp.json().get("access_token")


def polygon_center(coords):
    """
    Rough center of a GeoJSON Polygon (lon, lat) average of vertices.
    coords: list of linear ring arrays [[lon,lat], ...] first ring.
    """
    ring = coords[0]
    lon = sum(p[0] for p in ring) / len(ring)
    lat = sum(p[1] for p in ring) / len(ring)
    return lat, lon  # return (lat, lon)


# --- Routes ---

@app.route("/chat", methods=["POST"])
def chat():
    """
    Body: { "message": "your question" }
    Returns: { "ok": true, "reply": "AI answer" }
    """
    if not OPENROUTER_API_KEY:
        return error("OPENROUTER_API_KEY missing on server", 500)

    data = request.get_json(silent=True) or {}
    user_msg = data.get("message", "").strip()
    if not user_msg:
        return error("message is required")

    url = f"{OPENROUTER_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        # Optional but recommended headers for OpenRouter attribution:
        "HTTP-Referer": "http://localhost",
        "X-Title": "FarmChainX-Flask",
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful farm assistant for traceability and crop care."},
            {"role": "user", "content": user_msg},
        ],
        "temperature": 0.2,
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    if resp.status_code != 200:
        return error(f"Chat provider error: {resp.text}", 502)

    out = resp.json()
    try:
        reply = out["choices"][0]["message"]["content"]
    except Exception:
        return error("Unexpected chat response", 502)

    return jsonify({"ok": True, "reply": reply})


@app.route("/crop-health", methods=["POST"])
def crop_health():
    """
    Multipart form-data:
      - image: file
    Returns: Roboflow predictions
    """
    if not ROBOFLOW_API_KEY or not ROBOFLOW_MODEL_ID:
        return error("Roboflow API config missing on server", 500)

    if "image" not in request.files:
        return error("image file is required")

    img_file = request.files["image"]

    # Build URL: https://detect.roboflow.com/<model_id>?api_key=...
    url = f"{ROBOFLOW_API_URL}/{ROBOFLOW_MODEL_ID}"
    params = {"api_key": ROBOFLOW_API_KEY}
    files = {"file": (img_file.filename, img_file.stream, img_file.mimetype)}

    resp = requests.post(url, params=params, files=files, timeout=60)
    if resp.status_code != 200:
        return error(f"Roboflow error: {resp.text}", 502)

    return jsonify({"ok": True, "predictions": resp.json()})


@app.route("/ndvi-weather", methods=["POST"])
def ndvi_weather():
    """
    Body:
    {
      "polygon": { "type":"Polygon", "coordinates":[ [ [lon,lat],... ] ] },
      "from": "2025-06-01",
      "to":   "2025-06-30"
    }
    Returns: NDVI daily stats and simple weather.
    """
    body = request.get_json(silent=True) or {}
    poly = body.get("polygon")
    t_from = body.get("from")
    t_to = body.get("to")

    if not poly or poly.get("type") != "Polygon":
        return error("polygon (GeoJSON Polygon) is required")
    if not t_from or not t_to:
        return error("from and to dates are required (YYYY-MM-DD)")

    # 1) Sentinel Hub NDVI timeseries via Statistical API
    if not SH_CLIENT_ID or not SH_CLIENT_SECRET:
        return error("Sentinel Hub credentials missing on server", 500)

    token = get_sentinalhub_token()

    # Evalscript for NDVI (B08=NIR, B04=RED)
    evalscript = """
//VERSION=3
function setup() {
  return {
    input: [{bands: ["B04","B08","dataMask"]}],
    output: [
      { id: "ndvi", bands: 1 },
      { id: "dataMask", bands: 1 }
    ]
  };
}
function evaluatePixel(s) {
  let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  return { ndvi: [ndvi], dataMask: [s.dataMask] };
}
"""

    stat_payload = {
        "input": {
            "bounds": {
                "geometry": poly
            },
            "data": [
                {
                    "type": "S2L2A"
                }
            ]
        },
        "aggregation": {
            "timeRange": {"from": f"{t_from}T00:00:00Z", "to": f"{t_to}T23:59:59Z"},
            "aggregationInterval": {"of": "P1D"},
            "resx": 10, "resy": 10,
            "evalscript": evalscript
        },
        "calculations": {
            "ndvi": [
                {"stat": "mean"},
                {"stat": "min"},
                {"stat": "max"},
                {"stat": "stDev"},
                {"stat": "median"}
            ]
        }
    }

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    ndvi_resp = requests.post(SH_STAT_API, headers=headers, json=stat_payload, timeout=120)
    if ndvi_resp.status_code != 200:
        return error(f"Sentinel Hub error: {ndvi_resp.text}", 502)
    ndvi_json = ndvi_resp.json()

    # 2) Simple weather from Open-Meteo (center of polygon)
    lat, lon = polygon_center(poly["coordinates"])
    weather_params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,relative_humidity_2m",
        "timezone": "auto"
    }
    weather_resp = requests.get(OPEN_METEO_URL, params=weather_params, timeout=30)
    if weather_resp.status_code != 200:
        return error(f"Open-Meteo error: {weather_resp.text}", 502)

    return jsonify({"ok": True, "ndvi": ndvi_json, "weather": weather_resp.json()})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "FarmChainX Flask AI"}), 200


if __name__ == "__main__":
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host="0.0.0.0", port=port)

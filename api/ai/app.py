from flask import Flask, request, jsonify
import sys
import os
from pathlib import Path

# Add TMDB to path to import predictor
BASE_DIR = Path(__file__).parent.parent.parent
TMDB_DIR = BASE_DIR / "TMDB"
sys.path.append(str(TMDB_DIR))

try:
    from predictor import predict_movie_success
except ImportError:
    import predictor
    predict_movie_success = predictor.predict_movie_success

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No input data provided"}), 400
        
        # Calculate prediction using production-grade logic
        result = predict_movie_success(data)
        
        # Add success status
        result['status'] = 'success'
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Movie Prediction Service is running"})

if __name__ == '__main__':
    # Production-ready Flask usually uses Gunicorn, 
    # but for this requirement, we'll make it ready for local dev/deployment.
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Movie Prediction API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)

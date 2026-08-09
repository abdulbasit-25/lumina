import json
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
    # If not in path, try direct import if file exists
    import predictor
    predict_movie_success = predictor.predict_movie_success

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_raw = sys.stdin.read()
        if not input_raw:
            print(json.dumps({"status": "error", "message": "Empty input"}))
            sys.exit(1)
            
        input_data = json.loads(input_raw)
        
        # Make prediction using the new production-grade logic
        result = predict_movie_success(input_data)
        
        # Add status for compatibility with existing Next.js route
        result['status'] = 'success'
        
        # Output result as JSON
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        print(json.dumps({"status": "error", "message": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

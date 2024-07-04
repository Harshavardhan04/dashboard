from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app)

def generate_continuous_data(start_date, num_days):
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    data = []
    for i in range(num_days):
        date = (start_date + timedelta(days=i)).strftime("%Y-%m-%dT%H:%M:%SZ")  # UTC format
        data.append({
            "Date": date,
            "Target": round(random.uniform(50, 150), 2),
            "AUD": round(random.uniform(0, 100), 2),
            "EUR": round(random.uniform(0, 100), 2),
            "GBP": round(random.uniform(0, 100), 2),
            "JPY": round(random.uniform(0, 100), 2),
            "USD": round(random.uniform(0, 100), 2)
        })
    return data

@app.route('/xva', methods=['GET'])
def get_data():
    start_date = request.args.get('start_date', '2023-01-01')
    num_days = int(request.args.get('num_days', 30))
    data = generate_continuous_data(start_date, num_days)
    return jsonify(data)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

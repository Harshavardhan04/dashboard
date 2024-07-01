# api.py
#npm install react-data-table-component react-datepicker
#npm install react-data-table-component react-datepicker highcharts highcharts-react-official
# npm install react-resizable


from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app, resources={r"/xva": {"origins": "http://localhost:3000"}})


def generate_continuous_data(start_date, num_days):
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    data = []
    for i in range(num_days):
        date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
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

if __name__ == '__main__':
    app.run(debug=True)

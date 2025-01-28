import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ------------------------------------------------------
# TFL Stop IDs and Lines
# Update these if needed
# ------------------------------------------------------
STOP_A_ID = "490011642E"  # for line "33"
STOP_B_ID = "490011715C"  # for line "419"
LINE_A = "33"
LINE_B = "419"

# If you have your TFL subscription key, store it in an env var:
# e.g., export TFL_PRIMARY_KEY="xxxxxx"
TFL_PRIMARY_KEY = os.environ.get('TFL_PRIMARY_KEY')

# We'll define a cutoff: ignore any bus more than 2 hours away
timeCutoffMins = 120  # Adjust to whatever makes sense for you (in minutes)

def fetch_arrivals(stop_id, line_name):
    """
    Fetch real-time arrivals for a given TFL stop & line,
    ignoring any arrivals that are more than 'timeCutoffMins' in the future.
    """
    url = f"https://api.tfl.gov.uk/StopPoint/{stop_id}/Arrivals"
    
    headers = {}
    if TFL_PRIMARY_KEY:
        # TFL's recommended header name for subscription key
        headers["ocp-apim-subscription-key"] = TFL_PRIMARY_KEY

    try:
        r = requests.get(url, headers=headers, timeout=5)
        if r.status_code != 200:
            print(f"Error from TFL ({stop_id}, {line_name}): {r.status_code}")
            return []

        arrivals = r.json()  # list of arrival objects

        # Filter by line name
        filtered = [a for a in arrivals if a.get('lineName') == line_name]

        # Sort by earliest arrival
        filtered.sort(key=lambda x: x['timeToStation'])

        # Now exclude anything that arrives in more than 2 hours
        # e.g. If TFL says next bus is 5 hours away, we show "no bus"
        valid = []
        for arr in filtered:
            tts = arr.get('timeToStation', 9999999)  # default large if missing
            if 0 <= tts <= timeCutoffMins * 60:
                valid.append(arr)

        return valid

    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return []


@app.route('/api/bus-info', methods=['GET'])
def bus_info():
    """
    Merge arrivals for lines 33 & 419 at their respective stops,
    return the earliest 2 within the cutoff window.
    """
    arrivals_a = fetch_arrivals(STOP_A_ID, LINE_A)
    arrivals_b = fetch_arrivals(STOP_B_ID, LINE_B)

    combined = arrivals_a + arrivals_b
    if not combined:
        return jsonify({
            "message": "Cuchi, no hay buses ahorita. Love you!"
        }), 200

    # Sort everything by earliest arrival
    combined.sort(key=lambda x: x['timeToStation'])

    def format_arrival(arr):
        return {
            "stopId": arr.get("naptanId"),
            "stopName": arr.get("stationName") or "Unknown Stop",
            "lineName": arr.get("lineName"),
            "destination": arr.get("destinationName"),
            "arrivalMins": arr.get("timeToStation", 0) // 60
        }

    bestBus = format_arrival(combined[0])
    nextBus = format_arrival(combined[1]) if len(combined) > 1 else None

    return jsonify({
        "bestBus": bestBus,
        "nextBus": nextBus
    }), 200

@app.route('/')
def index():
    return "Hola from the Bus App!"

if __name__ == '__main__':
    # By default, run on port 5001. Adjust as needed.
    app.run(debug=True, port=5001)

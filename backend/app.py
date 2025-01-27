import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------------------------------------
# Stop IDs + desired bus lines
# ---------------------------------------------
# You asked to change Stop A to 490011642E
# For demonstration, let's say Stop A is only for lineName "33"
STOP_ID_1 = "490011642E"
DESIRED_LINE_A = "33"

# Stop B remains your previous ID (or whatever ID you want),
# and we only care about lineName "419"
STOP_ID_2 = "490011715C"
DESIRED_LINE_B = "419"

# If TFL requires an app_id/app_key, fetch them from env variables or hardcode
# TFL_APP_ID = os.environ.get('TFL_APP_ID')
# TFL_APP_KEY = os.environ.get('TFL_APP_KEY')

def get_earliest_bus(stop_id, desired_line):
    """
    Fetch the earliest arriving bus for a given TFL stop,
    but only return data for the desired line (e.g., "419" or "33").
    """
    # Construct the URL + (optional) add credentials as query params
    # params = {'app_id': TFL_APP_ID, 'app_key': TFL_APP_KEY}
    # r = requests.get(f"https://api.tfl.gov.uk/StopPoint/{stop_id}/Arrivals", params=params)
    r = requests.get(f"https://api.tfl.gov.uk/StopPoint/{stop_id}/Arrivals")
    if r.status_code != 200:
        print(f"Error fetching data for stop {stop_id}: {r.status_code}")
        return None

    arrivals = r.json()  # should be a list of arrival objects

    # Filter to only include the desired bus line
    filtered = [a for a in arrivals if a.get('lineName') == desired_line]
    if not filtered:
        # Means there are no arrivals for the specific line we're interested in
        return None

    # Sort by earliest arrival time
    filtered.sort(key=lambda x: x['timeToStation'])
    earliest = filtered[0]
    arrival_mins = earliest['timeToStation'] // 60  # convert to integer minutes

    return {
        'stopId': stop_id,
        'lineName': earliest['lineName'],
        'destination': earliest['destinationName'],
        'arrivalMins': arrival_mins
    }

@app.route('/api/bus-info', methods=['GET'])
def bus_info():
    """
    Compare earliest bus times (for each stop's desired line)
    and return which one arrives first.
    """
    busA = get_earliest_bus(STOP_ID_1, DESIRED_LINE_A)
    busB = get_earliest_bus(STOP_ID_2, DESIRED_LINE_B)

    # If no results for either line, return custom message
    if not busA and not busB:
        return jsonify({
            'stopA': None,
            'stopB': None,
            'bestStop': None,
            'message': "There are no busses to take our daughter now, love you"
        }), 200

    # Decide which stop is best (earliest)
    if busA and busB:
        best = busA if busA['arrivalMins'] < busB['arrivalMins'] else busB
    else:
        best = busA or busB

    return jsonify({
        'stopA': busA,
        'stopB': busB,
        'bestStop': best
    })

@app.route('/')
def index():
    return "Hello from the Bus App!"

if __name__ == '__main__':
    app.run(debug=True)

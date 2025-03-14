import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ------------------------------------------------------
# TFL Stop + Line Settings
# ------------------------------------------------------
STOP_A_ID = "490011642E"  # line "33"
STOP_B_ID = "490011715C"  # line "419"
LINE_A = "33"
LINE_B = "419"

# TFL Subscription Key
TFL_PRIMARY_KEY = os.environ.get('TFL_PRIMARY_KEY')

# We'll ignore arrivals more than 2 hours away
timeCutoffMins = 120

# ------------------------------------------------------
# OpenWeatherMap Settings
# ------------------------------------------------------
OWM_API_KEY = os.environ.get('OWM_API_KEY')  # e.g., 'abcdef123456'
CITY_NAME = "London" 
COUNTRY_CODE = "GB"

def fetch_arrivals(stop_id, line_name):
    """
    Fetch real-time arrivals for a given TFL stop & line.
    We exclude arrivals more than `timeCutoffMins` in the future.
    """
    url = f"https://api.tfl.gov.uk/StopPoint/{stop_id}/Arrivals"

    headers = {}
    if TFL_PRIMARY_KEY:
        headers["ocp-apim-subscription-key"] = TFL_PRIMARY_KEY

    try:
        r = requests.get(url, headers=headers, timeout=5)
        if r.status_code != 200:
            print(f"TFL error for {stop_id}-{line_name}: {r.status_code}")
            return []

        arrivals = r.json()
        # Filter by line
        filtered = [a for a in arrivals if a.get('lineName') == line_name]
        # Sort by earliest arrival
        filtered.sort(key=lambda x: x['timeToStation'])

        # Exclude anything beyond the cutoff (2 hours)
        valid = []
        for arr in filtered:
            tts = arr.get('timeToStation', 999999)
            if 0 <= tts <= timeCutoffMins * 60:
                valid.append(arr)
        return valid

    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return []

def fetch_weather():
    """
    Example call to OpenWeatherMap for current weather in London.
    Return a dict with { tempC, feelsLikeC, main, description, icon } 
    or None on error.
    """
    if not OWM_API_KEY:
        print("No OWM_API_KEY found. Weather will not be fetched.")
        return None

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={CITY_NAME},{COUNTRY_CODE}"
        f"&appid={OWM_API_KEY}&units=metric"
    )
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            print(f"OpenWeather error: {r.status_code}")
            return None
        data = r.json()
        
        main_data = data.get('main', {})
        weather_data = data.get('weather', [{}])[0]
        tempC = main_data.get('temp')         # Celsius from units=metric
        feelsC = main_data.get('feels_like')
        w_main = weather_data.get('main', '') # e.g. "Rain", "Clouds", "Clear"
        w_desc = weather_data.get('description', '')
        w_icon = weather_data.get('icon', '')

        return {
            "tempC": round(tempC) if tempC is not None else None,
            "feelsLikeC": round(feelsC) if feelsC is not None else None,
            "main": w_main,
            "description": w_desc,
            "icon": w_icon
        }

    except requests.exceptions.RequestException as e:
        print(f"Weather request error: {e}")
        return None

@app.route('/api/bus-info', methods=['GET'])
def bus_info():
    arrivals_a = fetch_arrivals(STOP_A_ID, LINE_A)
    arrivals_b = fetch_arrivals(STOP_B_ID, LINE_B)

    combined = arrivals_a + arrivals_b
    combined.sort(key=lambda x: x['timeToStation'])

    def format_arrival(arr):
        return {
            "stopId": arr.get('naptanId'),
            "stopName": arr.get('stationName') or "Unknown Stop",
            "lineName": arr.get('lineName'),
            "destination": arr.get('destinationName'),
            "arrivalMins": arr.get('timeToStation', 0) // 60
        }

    if not combined:
        return jsonify({
            "message": "There are no buses to take our daughter now, love you",
            "weather": fetch_weather()
        }), 200

    bestBus = format_arrival(combined[0])
    nextBus = format_arrival(combined[1]) if len(combined) > 1 else None

    return jsonify({
        "bestBus": bestBus,
        "nextBus": nextBus,
        "weather": fetch_weather()
    }), 200

@app.route('/')
def index():
    return "Hello from the Bus App!"

if __name__ == '__main__':
    app.run(debug=True, port=5001)

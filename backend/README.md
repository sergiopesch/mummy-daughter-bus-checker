# Mummy & Daughter Bus Checker - Backend

This is the **Flask** backend that fetches:
- **Real-time bus arrivals** from London’s TFL API.
- (Optionally) **Weather** data from OpenWeatherMap.

It provides a simple JSON response with:
- `bestBus` (the next soonest bus),
- `nextBus` (the second soonest),
- `weather` (temp, feels-like, condition) if configured,
- or a custom “no buses” message.

## Getting Started Locally

1. **Install** Python 3.x and create a virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   # or: venv\Scripts\activate  (Windows)

2. **Install Dependencies** 

   pip install -r requirements.txt

3. **Set Up Environment Variables**

   Create a `.env` file in the backend directory with your API keys:

   ```
   TFL_API_KEY=your_tfl_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Run the Flask Server**

   ```bash
   python app.py
   ```

   The server runs on http://127.0.0.1:5001

5. **Test it**

   Open http://127.0.0.1:5001 in your browser.
   You should see JSON data about buses or a custom “no buses” message.

**Files & Structure**
- `app.py`: Main Flask application.
- `requirements.txt`: Python dependencies.

**Next Steps**
To use this backend with the React frontend, ensure the frontend’s fetch URL (in App.js) points to where this Flask server is hosted.


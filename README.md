# London Bus Checker

A **mobile-friendly** web app to see which bus is best to catch near Roehampton, London.  
Designed for quick, real-time updates so you can get your daughter to nursery on time.

## Features

- **Flask Backend** calling TFL’s API to retrieve arrivals for two bus stops.
- **React Frontend** that highlights the best bus (soonest arrival).
- **Responsive Design** for iPhones and small screens.
- **Deployed to AWS Lambda + API Gateway** for a serverless, scalable solution.

## Tech Stack

- **Python + Flask** (backend)
- **React** (frontend)
- **Zappa** for serverless deployment on AWS
- **TFL StopPoint API** for real-time arrival info

## Local Setup

1. **Clone** this repo.
2. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python app.py
   ```
   The Flask server runs on http://127.0.0.1:5000

3. **Frontend**:
    cd ../frontend
    npm install
    npm start
    The React app runs on http://localhost:3000
    Make sure the fetch URL in App.js is http://127.0.0.1:5000/api/bus-info if running locally

    


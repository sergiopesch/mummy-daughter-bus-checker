import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [busData, setBusData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local dev URL (change to your AWS Lambda or other public URL when deployed)
  const BACKEND_URL = 'http://127.0.0.1:5001/api/bus-info';

  const fetchBusData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BACKEND_URL);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data = await res.json();
      setBusData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData();
  }, []);

  // Error State
  if (error) {
    return (
      <div className="app-container">
        <header className="header-message">
          <h1>Bus Checker</h1>
          <p className="greeting">Buenos dias mi cuchi linda!</p>
        </header>
        <div className="error-message">
          <h2>Error: {error}</h2>
          <button onClick={fetchBusData} className="refresh-button">Try Again</button>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="app-container">
        <header className="header-message">
          <h1>Bus Checker</h1>
          <p className="greeting">Buenos dias mi cuchi linda!</p>
        </header>
        <div className="loading-message">Loading bus info...</div>
      </div>
    );
  }

  // No buses
  if (busData?.message) {
    return (
      <div className="app-container">
        <header className="header-message">
          <h1>Bus Checker</h1>
          <p className="greeting">Buenos dias mi cuchi linda!</p>
        </header>
        <div className="no-buses-message">
          <p>{busData.message}</p>
        </div>
        <button onClick={fetchBusData} className="refresh-button">Refresh</button>
      </div>
    );
  }

  // We have bestBus and possibly nextBus
  const { bestBus, nextBus } = busData;

  return (
    <div className="app-container">
      <header className="header-message">
        <h1>Bus Checker</h1>
        <p className="greeting">
          Buenos dias mi cuchi linda! Este es el mejor bus para ti ahorita.
        </p>
      </header>

      {/* BEST BUS CARD */}
      {bestBus && (
        <div className="best-bus-card">
          <h2>Mejor Bus</h2>
          <p className="stop-name">{bestBus.stopName}</p>
          <p><strong>Línea:</strong> {bestBus.lineName}</p>
          <p><strong>Destino:</strong> {bestBus.destination}</p>
          <p><strong>Arrival in:</strong> {bestBus.arrivalMins} min</p>
        </div>
      )}

      {/* NEXT BUS CARD */}
      {nextBus && (
        <div className="next-bus-card">
          <h2>Siguiente Bus</h2>
          <p className="stop-name">{nextBus.stopName}</p>
          <p><strong>Línea:</strong> {nextBus.lineName}</p>
          <p><strong>Destino:</strong> {nextBus.destination}</p>
          <p><strong>Arrival in:</strong> {nextBus.arrivalMins} min</p>
        </div>
      )}

      <button onClick={fetchBusData} className="refresh-button">Refresh</button>
    </div>
  );
}

export default App;

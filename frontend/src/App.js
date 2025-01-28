import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Spanish greeting logic:
 *  - 5am-11:59am => Buenos días
 *  - 12pm-18:59 => Buenas tardes
 *  - otherwise => Buenas noches
 */
function getSpanishGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function App() {
  const [busData, setBusData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Adjust to your local or deployed backend endpoint
  const BACKEND_URL = 'http://127.0.0.1:5001/api/bus-info';

  const fetchBusData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BACKEND_URL);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
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

  // We'll compute the greeting once
  const greeting = getSpanishGreeting();

  /* ----------------------------------------------------------------
   * RENDER STATES
   * ----------------------------------------------------------------
   */

  // 1) ERROR
  if (error) {
    return (
      <div className="container">
        <HeroSection greeting={greeting} />
        <div className="error-card card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchBusData} className="refresh-button">Reintentar</button>
        </div>
      </div>
    );
  }

  // 2) LOADING
  if (loading) {
    return (
      <div className="container">
        <HeroSection greeting={greeting} />
        <div className="loading-card card">
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  // 3) NO BUSES
  if (busData?.message) {
    return (
      <div className="container">
        <HeroSection greeting={greeting} />
        {/* Weather card if we have data */}
        {busData.weather && <WeatherCard weather={busData.weather} />}
        <div className="no-bus-card card">
          <p>{busData.message}</p>
        </div>
        <button onClick={fetchBusData} className="refresh-button">Refrescar</button>
      </div>
    );
  }

  // 4) NORMAL: we have bestBus, nextBus, weather
  const { bestBus, nextBus, weather } = busData;

  return (
    <div className="container">
      <HeroSection greeting={greeting} />

      {/* Weather */}
      {weather && <WeatherCard weather={weather} />}

      {/* Best Bus */}
      {bestBus && (
        <div className="best-bus-card card">
          <h2>Mejor Bus</h2>
          <p className="bus-stop-name">{bestBus.stopName}</p>
          <p><strong>Número de Bus:</strong> {bestBus.lineName}</p>
          <p><strong>Destino:</strong> {bestBus.destination}</p>
          <p><strong>Llega en:</strong> {bestBus.arrivalMins} min</p>
        </div>
      )}

      {/* Next Bus */}
      {nextBus && (
        <div className="next-bus-card card">
          <h2>Siguiente Bus</h2>
          <p className="bus-stop-name">{nextBus.stopName}</p>
          <p><strong>Número de Bus:</strong> {nextBus.lineName}</p>
          <p><strong>Destino:</strong> {nextBus.destination}</p>
          <p><strong>Llega en:</strong> {nextBus.arrivalMins} min</p>
        </div>
      )}

      <button onClick={fetchBusData} className="refresh-button">
        Refrescar
      </button>
    </div>
  );
}

/* 
 * HeroSection: top banner with bus image + greeting 
 */
function HeroSection({ greeting }) {
  return (
    <div className="hero">
      {/* Bus image is stored in public/bus.png */}
      <img src="/bus.png" alt="Red London Bus" className="bus-image" />
      <div className="hero-text">
        <h1>Mummy &amp; Daughter Bus Checker</h1>
        <p>{greeting}, mi cuchi linda!</p>
      </div>
    </div>
  );
}

/*
 * Weather Card (Clima)
 */
function WeatherCard({ weather }) {
  const { tempC, feelsLikeC, main, description, icon } = weather;
  const iconUrl = icon ? `http://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <div className="weather-card card">
      <h2>Clima</h2>
      {iconUrl && (
        <img src={iconUrl} alt={description} className="weather-icon" />
      )}
      <p><strong>Estado:</strong> {main} ({description})</p>
      <p><strong>Temperatura:</strong> {tempC}°C</p>
      <p><strong>Sensación:</strong> {feelsLikeC}°C</p>
    </div>
  );
}

export default App;

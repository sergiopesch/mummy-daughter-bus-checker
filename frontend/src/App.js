import HeroSection from './components/HeroSection';
import WeatherCard from './components/WeatherCard';
import BusCard from './components/BusCard';
import './theme/variables.css';
import './theme/global.css';
import React, { useState, useEffect } from 'react';
import {
  IonApp,
  IonPage,
  IonContent,
  IonSpinner,
  IonButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';

/* Ionicons icon registration (for the pull-to-refresh icon) */
import { addIcons } from 'ionicons';
import { arrowDownCircleOutline } from 'ionicons/icons';
addIcons({ 'arrow-down-circle-outline': arrowDownCircleOutline });

export default function App() {
  const [busData, setBusData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://127.0.0.1:5001/api/bus-info';

  async function fetchBusData() {
    console.log("Starting fetchBusData...");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BACKEND_URL);
      console.log("Fetch response:", response);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setBusData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Finished fetchBusData.");
    }
  }

  // Fetch once on mount
  useEffect(() => {
    fetchBusData();
  }, []);

  // Pull-to-refresh callback
  const handleRefresh = async (event) => {
    await fetchBusData();
    event.detail.complete(); // Stop IonRefresher spinner
  };

  return (
    <IonApp>
      <IonPage>
        <IonContent fullscreen>
          {/* iOS Pull to Refresh */}
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent
              pullingIcon="arrow-down-circle-outline"
              refreshingSpinner="circles"
              pullingText="Pull to refresh"
              refreshingText="Refreshing..."
            />
          </IonRefresher>

          {/* Centered container for all content */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              {/* Hero Section at top */}
              <HeroSection />

              {/* Error */}
              {error && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <h2>Error</h2>
                  <p>{error}</p>
                  <IonButton onClick={fetchBusData} color="danger">
                    Reintentar
                  </IonButton>
                </div>
              )}

              {/* Loading */}
              {loading && !error && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <IonSpinner name="crescent" />
                  <p>Cargando información...</p>
                </div>
              )}

              {/* If backend returned a message (e.g., "No buses available") */}
              {busData?.message && !loading && !error && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <h2>{busData.message}</h2>
                </div>
              )}

              {/* Bus Cards */}
              {!loading && !error && busData && !busData.message && (
                <>
                  {busData.bestBus && (
                    <BusCard
                      busData={busData.bestBus}
                      colorClass="bus-card-green"
                    />
                  )}
                  {busData.nextBus && (
                    <BusCard
                      busData={busData.nextBus}
                      colorClass="bus-card-blue"
                    />
                  )}
                </>
              )}

              {/* Weather Card at the bottom */}
              {!loading && !error && busData?.weather && (
                <WeatherCard weather={busData.weather} />
              )}

              {/* Fallback: No data at all */}
              {!loading && !error && !busData && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <h3>No data to display (busData is null or empty).</h3>
                </div>
              )}
            </div>
          </div>
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

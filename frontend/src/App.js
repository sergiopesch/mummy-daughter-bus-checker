import React, { useEffect, useState } from 'react';

function App() {
  const [busData, setBusData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from our Flask backend
    fetch('http://127.0.0.1:5001/api/bus-info')
      .then((response) => {
        if (!response.ok) {
          // If Flask returned a 4xx or 5xx, handle it
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBusData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  // If there's an error in the fetch, display it
  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>
      <h2>Error: {error}</h2>
    </div>;
  }

  // If the data hasn't loaded yet, show a loading indicator
  if (!busData) {
    return <div style={{ textAlign: 'center' }}>Loading bus info...</div>;
  }

  // Check if the backend sent a special "message" (e.g., no buses)
  if (busData.message) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Bus Checker</h1>
        <p style={{ fontStyle: 'italic', color: 'red' }}>{busData.message}</p>
      </div>
    );
  }

  // Destructure our data for readability
  const { stopA, stopB, bestStop } = busData;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Bus Checker</h1>

      {/* Stop A Card */}
      <div style={{
        ...styles.stopCard,
        borderColor: bestStop?.stopId === stopA?.stopId ? '#28a745' : '#ccc',
      }}>
        <h2>Stop A</h2>
        {stopA ? (
          <>
            <p><strong>Line:</strong> {stopA.lineName}</p>
            <p><strong>Destination:</strong> {stopA.destination}</p>
            <p><strong>Arrival in:</strong> {stopA.arrivalMins} min</p>
          </>
        ) : (
          <p>No arrival data for Stop A.</p>
        )}
      </div>

      {/* Stop B Card */}
      <div style={{
        ...styles.stopCard,
        borderColor: bestStop?.stopId === stopB?.stopId ? '#28a745' : '#ccc',
      }}>
        <h2>Stop B</h2>
        {stopB ? (
          <>
            <p><strong>Line:</strong> {stopB.lineName}</p>
            <p><strong>Destination:</strong> {stopB.destination}</p>
            <p><strong>Arrival in:</strong> {stopB.arrivalMins} min</p>
          </>
        ) : (
          <p>No arrival data for Stop B.</p>
        )}
      </div>

      {/* Best Stop */}
      <div style={styles.bestStopCard}>
        {bestStop ? (
          <p style={{ fontWeight: 'bold', color: '#28a745' }}>
            Best stop is <strong>{bestStop.stopId}</strong>! Bus arrives in <strong>{bestStop.arrivalMins}</strong> min.
          </p>
        ) : (
          <p>No best stop found.</p>
        )}
      </div>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '2rem auto',
    textAlign: 'center',
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  stopCard: {
    border: '2px solid #ccc',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  bestStopCard: {
    border: '1px solid #28a745',
    borderRadius: '6px',
    padding: '1rem',
    marginTop: '1rem',
  },
};

export default App;

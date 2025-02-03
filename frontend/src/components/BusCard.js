import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';

/**
 * BusCard
 * Props: busData = { lineName, stopName, destination, arrivalMins }
 *        colorClass => "bus-card-green" or "bus-card-blue" (optional)
 */
export default function BusCard({ busData, colorClass }) {
  if (!busData) return null;

  const { lineName, stopName, destination, arrivalMins } = busData;

  // Pulsing animation for time icon
  const timeIconStyle = {
    animation: 'pulse 1.5s infinite alternate',
    fontSize: '1.5rem',
    color: '#f6c623'
  };

  return (
    <>
      {/* Keyframes and color classes inline, removing need for extra CSS file */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.3); }
          }
          .bus-card-green {
            border-left: 8px solid #37df69;
          }
          .bus-card-blue {
            border-left: 8px solid #64b5f6;
          }
        `}
      </style>

      <IonCard
        className={colorClass}
        style={{
          margin: '1rem auto',
          maxWidth: '600px'
        }}
      >
        <IonCardContent style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          {/* Top row: bus icon + bus number, and arrival time on the right */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Left side: Bus icon & line */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <img
                src="/bus.png"
                alt="Bus icon"
                style={{
                  width: '40px',
                  height: '40px',
                  marginRight: '8px',
                  flexShrink: 0
                }}
              />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {lineName}
              </div>
            </div>

            {/* Right side: arrival time icon + minutes */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IonIcon icon={timeOutline} style={timeIconStyle} />
              <span style={{ marginLeft: '0.5rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {arrivalMins} min
              </span>
            </div>
          </div>

          {/* Second row: bus stop & destination */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.95rem', color: '#555' }}>
              {stopName}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
              {destination}
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
}

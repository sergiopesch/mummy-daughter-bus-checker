import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import {
  sunnyOutline,
  cloudyOutline,
  rainyOutline,
  thunderstormOutline,
  snowOutline
} from 'ionicons/icons';

/**
 * WeatherCard
 * Props: weather = { tempC, feelsLikeC, main, description, highC, lowC }
 */
export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const {
    tempC,
    feelsLikeC,
    main,
    description,
    highC,
    lowC
  } = weather;

  // Map "main" to IonIcons
  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clouds':
        return cloudyOutline;
      case 'Rain':
        return rainyOutline;
      case 'Thunderstorm':
        return thunderstormOutline;
      case 'Snow':
        return snowOutline;
      case 'Clear':
      default:
        return sunnyOutline;
    }
  };

  const iconToUse = getWeatherIcon(main);

  return (
    <IonCard
      className="ios-weather-card"
      style={{
        margin: '1rem auto',
        maxWidth: '600px'
      }}
    >
      <IonCardContent style={{ padding: '1.5rem' }}>
        {/* Top row: City + icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side: city + big temp + condition */}
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '500' }}>London</div>
            <div style={{ fontSize: '3rem', fontWeight: '300', margin: '0.25rem 0' }}>
              {tempC}°
            </div>
            <div style={{ fontSize: '1rem' }}>
              {main} – {description}
            </div>
          </div>
          {/* Right side: Big weather icon */}
          <IonIcon
            icon={iconToUse}
            style={{ fontSize: '4rem', color: '#fff' }}
          />
        </div>

        {/* High/Low or Feels Like */}
        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          {typeof highC === 'number' && typeof lowC === 'number' ? (
            <div>H: {highC}°, L: {lowC}°</div>
          ) : (
            <div style={{ fontSize: '1.35rem', fontWeight: '500' }}>Sensación: {feelsLikeC}°</div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
}

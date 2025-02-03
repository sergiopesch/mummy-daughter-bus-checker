import React from 'react';

/**
 * Return Spanish greeting based on current hour:
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

export default function HeroSection() {
  const greeting = getSpanishGreeting();

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        marginTop: '1rem'
      }}
    >
      <img
        src="/bus.png"
        alt="Red London Bus"
        style={{ width: 80, height: 80 }}
      />
      <h2 style={{ margin: '0.5rem 0', color: '#d9534f' }}>
        Mum &amp; Daughter Bus Checker
      </h2>
      <p style={{ margin: 0, fontSize: '1.1rem', color: '#555' }}>
        {greeting}, my love!
      </p>
    </div>
  );
}

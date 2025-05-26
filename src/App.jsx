import React from 'react';
import Calendar from './components/Calendar';
import './styles/calendar.css';

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333', textAlign: 'center' }}>
        Custom Event Calendar
      </h1>
      <Calendar />
    </div>
  );
}

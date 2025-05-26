import React from 'react';

export default function EventItem({ event, onClick }) {
  return (
    <div 
      onClick={() => onClick(event)} 
      style={{ backgroundColor: event.color || '#3174ad', padding: '2px 6px', borderRadius: 4, marginBottom: 2, cursor: 'pointer', color: 'white', fontSize: 12, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      title={event.title}
    >
      {event.title}
    </div>
  );
}

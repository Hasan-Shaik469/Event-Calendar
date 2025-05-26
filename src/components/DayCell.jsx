import React from 'react';
import EventItem from './EventItem';

export default function DayCell({ date, events, onDayClick, onEventClick, isToday, isCurrentMonth }) {
  return (
    <div
      className={`day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'not-current-month' : ''}`}
      onClick={() => onDayClick(date)}
    >
      <div className="date-number">{date.getDate()}</div>
      <div className="events-container" onClick={e => e.stopPropagation()}>
        {events.map(event => (
          <EventItem key={event.id} event={event} onClick={onEventClick} />
        ))}
      </div>
    </div>
  );
}

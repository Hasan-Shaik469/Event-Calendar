import React from 'react';

export default function CalendarHeader({ currentMonth, onPrev, onNext }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-header">
      <button onClick={onPrev}>◀</button>
      <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
      <button onClick={onNext}>▶</button>
    </div>
  );
}

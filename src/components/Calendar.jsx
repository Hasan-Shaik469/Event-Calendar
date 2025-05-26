import React, { useState, useEffect } from 'react';
import { formatDate, expandRecurringEvents } from '../utils/dateUtils';
import { loadEvents, saveEvents } from '../utils/storage';
import CalendarHeader from './CalendarHeader';
import DayCell from './DayCell';
import EventModal from './EventModal';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';


function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Calculate previous month's last few days to fill calendar grid start
  const startDayOfWeek = firstDay.getDay(); // Sunday=0
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Fill end to complete weeks (up to 42 days)
  while (days.length < 42) {
    const last = days[days.length - 1];
    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }

  return days;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loaded = loadEvents();
    setEvents(loaded);
  }, []);

  function handlePrevMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }

  function openAddModal(date) {
    setSelectedDate(date);
    setEventToEdit(null);
    setModalOpen(true);
  }

  function openEditModal(event) {
    setEventToEdit(event);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedDate(null);
    setEventToEdit(null);
  }

  function hasConflict(newEvent) {
    return events.some(e => 
      e.id !== newEvent.id && 
      e.dateTime === newEvent.dateTime
    );
  }

  function saveEvent(newEvent) {
    if (hasConflict(newEvent)) {
      alert('Event conflict detected for this date/time.');
      return;
    }
    let updatedEvents;
    if (events.some(e => e.id === newEvent.id)) {
      updatedEvents = events.map(e => e.id === newEvent.id ? newEvent : e);
    } else {
      updatedEvents = [...events, newEvent];
    }
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }

  function deleteEvent(id) {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }

  const monthDays = getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Map date string => events
  const eventsByDate = {};
  monthDays.forEach(day => {
    const dayStr = formatDate(day);
    eventsByDate[dayStr] = expandRecurringEvents(filteredEvents, day);
  });

  // Drag and drop handlers for events
  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return; // No change

    const draggedEvent = events.find(e => e.id === draggableId);
    if (!draggedEvent) return;

    const newDate = destination.droppableId; // droppableId is date string
    const newDateTime = newDate + draggedEvent.dateTime.slice(10); // Keep time

    if (hasConflict({ ...draggedEvent, dateTime: newDateTime })) {
      alert('Conflict on new date/time!');
      return;
    }

    const updatedEvent = { ...draggedEvent, dateTime: newDateTime };
    const updatedEvents = events.map(e => e.id === draggedEvent.id ? updatedEvent : e);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }

  return (
    <>
      <CalendarHeader 
        currentMonth={currentMonth}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />

      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />


      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar-grid">
          {/* Weekday headers */}
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="weekday-header">{d}</div>
          ))}

          {monthDays.map(day => {
            const dayStr = formatDate(day);
            const isToday = formatDate(new Date()) === dayStr;
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            return (
              <Droppable key={dayStr} droppableId={dayStr}>
                {(provided) => (
                  <div
                    className={`day-cell-wrapper`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <DayCell
                      date={day}
                      isToday={isToday}
                      isCurrentMonth={isCurrentMonth}
                      events={eventsByDate[dayStr] || []}
                      onDayClick={openAddModal}
                      onEventClick={openEditModal}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <EventModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={saveEvent}
        onDelete={deleteEvent}
        eventToEdit={eventToEdit}
        selectedDate={selectedDate}
      />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { recurrenceOptions } from '../utils/dateUtils';

export default function EventModal({ isOpen, onClose, onSave, onDelete, eventToEdit, selectedDate }) {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('None');
  const [color, setColor] = useState('#3174ad');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDateTime(eventToEdit.dateTime);
      setDescription(eventToEdit.description);
      setRecurrence(eventToEdit.recurrence || 'None');
      setColor(eventToEdit.color || '#3174ad');
    } else if (selectedDate) {
      setTitle('');
      setDateTime(selectedDate.toISOString().slice(0,16));
      setDescription('');
      setRecurrence('None');
      setColor('#3174ad');
    }
  }, [eventToEdit, selectedDate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !dateTime) return alert('Title and Date/Time required');
    onSave({
      id: eventToEdit?.id || Date.now().toString(),
      title,
      dateTime,
      description,
      recurrence,
      color,
    });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <label>Title:
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label>Date & Time:
            <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
          </label>
          <label>Description:
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <label>Recurrence:
            <select value={recurrence} onChange={e => setRecurrence(e.target.value)}>
              {recurrenceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>
          <label>Color:
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          </label>
          <div className="modal-actions">
            <button type="submit">Save</button>
            {eventToEdit && <button type="button" onClick={() => { onDelete(eventToEdit.id); onClose(); }}>Delete</button>}
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

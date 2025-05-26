import { parseISO, isSameDay, addDays, addWeeks, addMonths } from 'date-fns';

export const recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly', 'Custom'];

export function expandRecurringEvents(events, date) {
  let eventsForDay = [];

  events.forEach(event => {
    const eventDate = parseISO(event.dateTime);

    if (isSameDay(eventDate, date)) {
      eventsForDay.push(event);
      return;
    }

    if (event.recurrence === 'Daily' && eventDate <= date) {
      eventsForDay.push(event);
    } else if (event.recurrence === 'Weekly' && eventDate <= date && eventDate.getDay() === date.getDay()) {
      eventsForDay.push(event);
    } else if (event.recurrence === 'Monthly' && eventDate <= date && eventDate.getDate() === date.getDate()) {
      eventsForDay.push(event);
    }
    // You can add custom recurrence logic here if needed
  });

  return eventsForDay;
}

export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

import React from 'react';

// Renders hourly time labels between startHour..endHour (inclusive start, inclusive end)
const formatHourLabel = (hour24) => {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let hour = hour24 % 12;
  if (hour === 0) hour = 12;
  return `${hour}:00 ${period}`;
};

const generateTimes = (startHour = 0, endHour = 23) => {
  const times = [];
  for (let h = startHour; h <= endHour; h++) times.push(formatHourLabel(h));
  return times;
};

export const RenderTimeslots = ({
  selectedTimes = [],
  onTimeSelect,
  bookings = [],
  selectedDate,
  startHour = 0,
  endHour = 23,
}) => {
  const TIMES = generateTimes(startHour, endHour);

  const isTimeSlotBooked = (time) => {
    const [hours, minutes, period] = time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const slotStart = new Date(selectedDate);
    slotStart.setHours(hour, parseInt(minutes), 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1);

    return bookings.some((booking) => {
      const startTimeStr = booking.startTime || booking.start_time || booking.start;
      const endTimeStr = booking.endTime || booking.end_time || booking.end;
      if (!startTimeStr || !endTimeStr) return false;
      const bookingStart = new Date(startTimeStr);
      const bookingEnd = new Date(endTimeStr);
      return bookingStart < slotEnd && bookingEnd > slotStart;
    });
  };

  // Render as 4 columns x 6 rows (row-major)
  return (
    <div className="time-slots-grid">
      {TIMES.map((time) => {
        const isBooked = isTimeSlotBooked(time);
        const isSelected = selectedTimes.includes(time);
        return (
          <button
            key={time}
            className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
            onClick={() => !isBooked && onTimeSelect(time)}
            disabled={isBooked}
          >
            <span style={{ display: 'inline-block' }}>{time}</span>
            {isBooked && <span style={{ float: 'right', color: '#ef4444' }}>•</span>}
          </button>
        );
      })}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../features/bookings/api/bookingService';
import { RenderTimeslots } from './BookingComponents/RenderTimeslots.jsx';
import '../../styles/auth.css';
import '../../styles/booking.css';

const TIMES = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];

const BookingPage = () => {
  const { courtId } = useParams();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courtName, setCourtName] = useState('');

  // Map court IDs to names
  useEffect(() => {
    const loadInitialData = async () => {
      if (courtId) {
        try {
          // Fetch the court details properly
          const courtData = await bookingService.getCourtById(courtId);

          setCourtName(courtData?.name || courtData?.court?.name || 'Unknown Court');
          
          await fetchBookings();
        } catch (err) {
          console.error("Failed to load court info:", err);
          setCourtName("Error loading court");
        }
      }
    };

    loadInitialData();
  }, [selectedDate, courtId]);

  const fetchBookings = async () => {
    try {
      // Use local date components instead of toISOString() to avoid timezone shift
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      let bookingsData = await bookingService.getBookingsByDate(dateStr, courtId);
      
      // Handle different response formats
      if (bookingsData && bookingsData.data) {
        bookingsData = bookingsData.data;
      }
      if (!Array.isArray(bookingsData)) {
        bookingsData = [];
      }
      
      console.log('FETCH BOOKINGS:', { dateStr, courtId, bookingsData, count: bookingsData.length });
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const getTimeIndex = (time) => TIMES.indexOf(time);
  const getSortedTimes = (times) => [...times].sort((a, b) => getTimeIndex(a) - getTimeIndex(b));

  const isTimeBooked = (time) => {
    const [hours, minutes, period] = time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const slotStart = new Date(selectedDate);
    slotStart.setHours(hour, parseInt(minutes), 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1);

    return bookings.some(booking => {
      // Handle different property names
      const startTimeStr = booking.startTime || booking.start_time || booking.start;
      const endTimeStr = booking.endTime || booking.end_time || booking.end;
      
      if (!startTimeStr || !endTimeStr) {
        console.warn('Booking missing time properties:', booking);
        return false;
      }
      
      const bookingStart = new Date(startTimeStr);
      const bookingEnd = new Date(endTimeStr);
      
      console.log('CHECKING SLOT:', { time, slotStart: slotStart.toISOString(), slotEnd: slotEnd.toISOString(), bookingStart: bookingStart.toISOString(), bookingEnd: bookingEnd.toISOString() });
      
      return bookingStart < slotEnd && bookingEnd > slotStart;
    });
  };

  const handleTimeSelect = (time) => {
    if (isTimeBooked(time)) return;

    setSelectedTimes(prevTimes => {
      const sortedTimes = getSortedTimes(prevTimes);
      const timeIndex = getTimeIndex(time);
      const currentStartIndex = sortedTimes.length ? getTimeIndex(sortedTimes[0]) : null;
      const currentEndIndex = sortedTimes.length ? getTimeIndex(sortedTimes[sortedTimes.length - 1]) : null;

      if (prevTimes.length === 0) {
        return [time];
      }

      if (prevTimes.includes(time)) {
        // If user clicks an already selected boundary slot, shrink the range.
        if (timeIndex === currentStartIndex) return sortedTimes.slice(1);
        if (timeIndex === currentEndIndex) return sortedTimes.slice(0, -1);
        return [time];
      }

      if (timeIndex === currentStartIndex - 1) {
        return [time, ...sortedTimes];
      }

      if (timeIndex === currentEndIndex + 1) {
        return [...sortedTimes, time];
      }

      return [time];
    });

    setError('');
  };


  const handleDateChange = (daysOffset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + daysOffset);
    newDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    // Prevent going to yesterday
    if (newDate < today) {
      return;
    }
    
    setSelectedDate(newDate);
    setSelectedTimes([]);
    setBookings([]); // Clear previous day's bookings
    setError('');
  };

  const handleBooking = async () => {
    if (selectedTimes.length === 0) {
      setError('Please select at least one time slot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sortedTimes = getSortedTimes(selectedTimes);
      const firstTime = sortedTimes[0];
      const lastTime = sortedTimes[sortedTimes.length - 1];
      
      const [startHours, startMinutes, startPeriod] = firstTime.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
      const [endHours, endMinutes, endPeriod] = lastTime.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
      
      let startHour = parseInt(startHours);
      let endHour = parseInt(endHours);
      
      if (startPeriod === 'PM' && startHour !== 12) startHour += 12;
      if (startPeriod === 'AM' && startHour === 12) startHour = 0;
      if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
      if (endPeriod === 'AM' && endHour === 12) endHour = 0;

      const startTime = new Date(selectedDate);
      startTime.setHours(startHour, parseInt(startMinutes), 0, 0);

      const endTime = new Date(selectedDate);
      endTime.setHours(endHour + 1, parseInt(endMinutes), 0, 0); // Add 1 hour to last selected time

      const bookingData = {
        courtId: courtId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice: 50 * selectedTimes.length // $50 per hour
      };

      await bookingService.createBooking(bookingData);
      setIsBookingConfirmed(true);
      await fetchBookings();
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setSelectedTimes([]);
    setIsBookingConfirmed(false);
    setError('');
  };

  if (isBookingConfirmed) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-logo">
            Padel<span>Club</span>
          </div>
          <div className="confirmed-icon">✓</div>
          <h2>Booking confirmed!</h2>
          <p className="auth-sub">Your court has been reserved. See you on the court!</p>
          <button className="auth-btn" onClick={resetBooking}>
            Book another court
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          Padel<span>Club</span>
        </div>
        <p className="auth-sub">Book your perfect court</p>

        {error && <div className="auth-alert">{error}</div>}
        
        <div className="auth-group">
          <label className="auth-label">Court</label>
          <div className="court-display">
            {courtName}
          </div>
        </div>

        <div className="auth-group">
          <label className="auth-label">Select Date</label>
          <div className="date-selector">
            <button
              type="button"
              className="date-btn"
              onClick={() => handleDateChange(-1)}
            >
              ←
            </button>
            <span className="date-display">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <button
              type="button"
              className="date-btn"
              onClick={() => handleDateChange(1)}
            >
              →
            </button>
          </div>
        </div>

        <div className="auth-group">
          <label className="auth-label">Select Time Slot</label>
          <div className="time-slots">
            <RenderTimeslots 
              selectedTimes={selectedTimes} 
              onTimeSelect={handleTimeSelect}
              bookings={bookings}
              selectedDate={selectedDate}
            />
          </div>
        </div>

        <button 
          className="auth-btn" 
          onClick={handleBooking}
          disabled={loading || selectedTimes.length === 0}
        >
          {loading ? 'Booking...' : `Book Court (${selectedTimes.length} hour${selectedTimes.length > 1 ? 's' : ''})`}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;

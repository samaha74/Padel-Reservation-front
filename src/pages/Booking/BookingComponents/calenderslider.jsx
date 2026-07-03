// Presentational Component for the Day Card
const DayCard = ({ date, isSelected, onClick }) => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
  const dayNumber = date.getDate(); // e.g., "4"

  return (
    <div 
      className={`day-card ${isSelected ? 'active' : ''}`} 
      onClick={() => onClick(date)}
    >
      <span>{dayName}</span>
      <strong>{dayNumber}</strong>
    </div>
  );
};



const generateDays = (count) => {
  const days = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i); // Adds 'i' days to today
    days.push(date);
  }
  return days;
};
function calculateTimeAgo(timestamp: number): string {
    const currentTime = Date.now() / 1000; // Get current time in seconds
    const timeDifference = currentTime - timestamp;
  
    const secondsInAMinute: number = 60;
    const secondsInAnHour: number = 3600;
    const secondsInADay: number = 86400;
    const secondsInAMonth: number = 2629800;
    const secondsInAYear: number = 31557600;
  
    if (timeDifference < secondsInAMinute) {
      const seconds = Math.floor(timeDifference);
      return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
    } else if (timeDifference < secondsInAnHour) {
      const minutes = Math.floor(timeDifference / secondsInAMinute);
      return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    } else if (timeDifference < secondsInADay) {
      const hours = Math.floor(timeDifference / secondsInAnHour);
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else if (timeDifference < secondsInAMonth) {
      const days = Math.floor(timeDifference / secondsInADay);
      return days === 1 ? `${days} day ago` : `${days} days ago`;
    } else if (timeDifference < secondsInAYear) {
      const months = Math.floor(timeDifference / secondsInAMonth);
      return months === 1 ? `${months} month ago` : `${months} months ago`;
    } else {
      const years = Math.floor(timeDifference / secondsInAYear);
      return years === 1 ? `${years} year ago` : `${years} years ago`;
    }
}

function areDatesOnSameDay(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
  
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();
  
    return year1 === year2 && month1 === month2 && day1 === day2;
}

function compareUTCNowToDateNormal(date: Date): string {
    const now = new Date((Math.floor(Date.now() / 1000) - 86400) * 1000);
    const tomorrow = new Date((Math.floor(Date.now() / 1000) - 86400) * 1000);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if tomorrow
    if (date.getFullYear() === tomorrow.getFullYear() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getDate() === tomorrow.getDate()) {
      	return 'Tomorrow';
    }
    
    // Check if within week
    const weekFromNow = new Date(now);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    if (date <= weekFromNow) {
      	return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    // Check if within year
    const yearFromNow = new Date(now);
    yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
    
    if (date <= yearFromNow) {
		const month = date.toLocaleDateString('en-US', { month: 'short' });
		const day = date.getDate();
		const suffix = getOrdinalSuffix(day);
		return `${month}, ${day}${suffix}`;
    }
    
    // More than a year away
    return date.toLocaleDateString('en-US', { 
		month: '2-digit', 
		day: '2-digit', 
		year: 'numeric' 
    });
}
  
function getOrdinalSuffix(day: number): string {
	if (day > 3 && day < 21) return 'th';
	switch (day % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
}

function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diffSeconds = now - timestamp
  const date = new Date(timestamp * 1000)
  
  // Format the date part
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Calculate the relative time
  const years = Math.floor(diffSeconds / (365 * 24 * 60 * 60))
  const months = Math.floor(diffSeconds / (30 * 24 * 60 * 60))
  const days = Math.floor(diffSeconds / (24 * 60 * 60))
  const hours = Math.floor(diffSeconds / (60 * 60))
  
  // Return appropriate string based on time difference
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago ${formattedDate}`
  }
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago ${formattedDate}`
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago ${formattedDate}`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago ${formattedDate}`
  }
  return `just now ${formattedDate}`
}

export {
  calculateTimeAgo,
  areDatesOnSameDay,
  formatRelativeTime,
	compareUTCNowToDateNormal
}
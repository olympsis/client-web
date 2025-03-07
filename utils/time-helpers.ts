function calculateTimeAgo(timestamp: number, verbose: boolean = true): string {
  const currentTime = Date.now() / 1000;
  const timeDifference = currentTime - timestamp;

  const secondsInAMinute = 60;
  const secondsInAnHour = 3600;
  const secondsInADay = 86400;
  const secondsInAMonth = 2629800;
  const secondsInAYear = 31557600;

  if (timeDifference < secondsInAMinute) {
      const seconds = Math.floor(timeDifference);
      return verbose ? 
          (seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`) :
          `${seconds}s`;
  } else if (timeDifference < secondsInAnHour) {
      const minutes = Math.floor(timeDifference / secondsInAMinute);
      return verbose ?
          (minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`) :
          `${minutes}m`;
  } else if (timeDifference < secondsInADay) {
      const hours = Math.floor(timeDifference / secondsInAnHour);
      return verbose ?
          (hours === 1 ? `${hours} hour ago` : `${hours} hours ago`) :
          `${hours}h`;
  } else if (timeDifference < secondsInAMonth) {
      const days = Math.floor(timeDifference / secondsInADay);
      return verbose ?
          (days === 1 ? `${days} day ago` : `${days} days ago`) :
          `${days}d`;
  } else if (timeDifference < secondsInAYear) {
      const months = Math.floor(timeDifference / secondsInAMonth);
      return verbose ?
          (months === 1 ? `${months} month ago` : `${months} months ago`) :
          `${months}mo`;
  } else {
      const years = Math.floor(timeDifference / secondsInAYear);
      return verbose ?
          (years === 1 ? `${years} year ago` : `${years} years ago`) :
          `${years}y`;
  }
}

function getMonthAndYear(timestamp: number): string {
	const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
	
	// Get month name
	const monthNames = [
	  "January", "February", "March", "April", "May", "June", 
	  "July", "August", "September", "October", "November", "December"
	];
	const month = monthNames[date.getMonth()];
	
	// Get year
	const year = date.getFullYear();
	
	// Return formatted string
	return `${month} ${year}`;
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
	const now = new Date(Math.floor(Date.now() / 1000) * 1000);
	const tomorrow = new Date(Math.floor(Date.now() / 1000) * 1000);
	tomorrow.setDate(tomorrow.getDate() + 1);

	// Check if today
	if (date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()) {
		return 'Today';
	}

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
	const now = Math.floor(Date.now() / 1000);
	const diffSeconds = now - timestamp;
	const date = new Date(timestamp * 1000);
  
	// Format the date part
	const formattedDate = date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
  
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
	return `just now ${formattedDate}`;
}

export {
	getMonthAndYear,
  	calculateTimeAgo,
  	areDatesOnSameDay,
  	formatRelativeTime,
	compareUTCNowToDateNormal
}
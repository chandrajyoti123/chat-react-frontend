import moment from 'moment';

export const getLastSeen = (lastSeen: any): string => {
  const date = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
  const now = new Date();

  const diffMs = now?.getTime() - date?.getTime();
  const diffSec = Math?.floor(diffMs / 1000);
  const diffMin = Math?.floor(diffSec / 60);
  const diffHour = Math?.floor(diffMin / 60);

  const isToday = date?.toDateString() === now?.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now?.getDate() - 1);
  const isYesterday = date?.toDateString() === yesterday?.toDateString();

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  if (diffSec < 60) return ' just now';
  if (diffMin < 60) return ` ${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24 && isToday) return ` today at ${date?.toLocaleTimeString([], timeOptions)}`;
  if (isYesterday) return ` yesterday at ${date?.toLocaleTimeString([], timeOptions)}`;

  // Older than yesterday
  return ` on ${date?.toLocaleDateString()} at ${date?.toLocaleTimeString([], timeOptions)}`;
};

export function formatMessageTime(dateString: string | Date) {
  const now = moment();
  const date = moment(dateString);

  if (!date.isValid()) return '';

  if (date.isSame(now, 'day')) {
    // Today → show time
    return date.format('h:mm A'); // e.g., 3:45 PM
  } else if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
    // Yesterday
    return 'Yesterday';
  } else if (date.isAfter(now.clone().subtract(7, 'days'))) {
    // Within last 7 days → weekday
    return date.format('ddd'); // e.g., Mon, Tue
  } else if (date.isSame(now, 'year')) {
    // This year → date without year
    return date.format('MMM D'); // e.g., Dec 25
  } else {
    // Older → full date
    return date.format('DD/MM/YYYY'); // e.g., 25/12/2024
  }
}

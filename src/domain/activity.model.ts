export enum ActivityType {
  STARTED = 'started',
  FINISHED = 'finished',
  RATED = 'rated',
  PROGRESS = 'progress',
  WANT_TO_READ = 'wantToRead',
  REVIEWED = 'reviewed',
  OTHER = 'other',
}

export interface Activity {
  message: string;
  bookId?: string;
  date: Date;
  formattedDate?: string;
}

export interface feedActivity extends Activity {
  userId: string;
  likes: string[] | null;
  profilePicture?: string | null;
}

// Activity Type Detection
export function getActivityType(message: string): ActivityType {
  if (message.includes('started reading')) {
    return ActivityType.STARTED;
  } else if (message.includes('finished reading')) {
    return ActivityType.FINISHED;
  } else if (message.includes('given a rating')) {
    return ActivityType.RATED;
  } else if (message.includes('made progress')) {
    return ActivityType.PROGRESS;
  } else if (message.includes('added') && message.includes('want to read')) {
    return ActivityType.WANT_TO_READ;
  } else if (
    message.includes('reviewed') ||
    message.includes('wrote a review')
  ) {
    return ActivityType.REVIEWED;
  } else {
    return ActivityType.OTHER;
  }
}

// Extract progress percentage from message
export function extractProgress(message: string): number | null {
  const activityType = getActivityType(message);
  if (activityType !== ActivityType.PROGRESS) return null;

  const pattern = /\((\d+)%\)/;
  const match = message.match(pattern);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

// Extract rating from message
export function extractRating(message: string): number | null {
  const activityType = getActivityType(message);
  if (activityType !== ActivityType.RATED) return null;

  const pattern = /rating of ([0-9.]+) stars/;
  const match = message.match(pattern);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  return null;
}

// Extract review from message
export function extractReview(message: string): string | null {
  const activityType = getActivityType(message);
  if (activityType !== ActivityType.REVIEWED) return null;

  // Si el mensaje contiene "reviewed" o "wrote a review", retornamos un indicador
  if (message.includes('reviewed') || message.includes('wrote a review')) {
    return 'Has review';
  }
  return null;
}

// Clean message by removing [bookId]
export function cleanMessage(message: string): string {
  const pattern = /\[\d+\]\s*/;
  return message.replace(pattern, '');
}

// Get icon for activity type
export function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case ActivityType.STARTED:
      return 'book';
    case ActivityType.FINISHED:
      return 'check_circle';
    case ActivityType.RATED:
      return 'star';
    case ActivityType.PROGRESS:
      return 'bar_chart';
    case ActivityType.WANT_TO_READ:
      return 'bookmark';
    case ActivityType.REVIEWED:
      return 'comment';
    case ActivityType.OTHER:
      return 'circle';
  }
}

// Get color for activity type
export function getActivityColor(type: ActivityType): string {
  switch (type) {
    case ActivityType.STARTED:
      return '#2196F3'; // blue
    case ActivityType.FINISHED:
      return '#9333ea'; // purple
    case ActivityType.RATED:
      return '#a855f7'; // purple light
    case ActivityType.PROGRESS:
      return '#9333ea'; // purple
    case ActivityType.WANT_TO_READ:
      return '#c084fc'; // purple lighter
    case ActivityType.REVIEWED:
      return '#a855f7'; // purple light
    case ActivityType.OTHER:
      return '#6b7280'; // neutral gray
  }
}

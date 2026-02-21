export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

export type TrackerEvent = {
  id: string;
  categoryId: string;
  timestamp: number; // ms
  note?: string;
};

export type DayData = {
  date: string; // YYYY-MM-DD
  events: TrackerEvent[];
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'solo-date', name: 'Solo Date', color: '#ffafcc', icon: 'Heart' },
  { id: 'rejection', name: 'Rejection', color: '#a2d2ff', icon: 'XCircle' },
  { id: 'learn-new', name: 'Learn Something New', color: '#bdb2ff', icon: 'Star' },
  { id: 'cook-recipe', name: 'Cook New Recipe', color: '#ffd60a', icon: 'Coffee' },
  { id: 'oops', name: 'Social Awkwardness', color: '#caffbf', icon: 'UserX' },
];


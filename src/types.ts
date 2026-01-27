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
  { id: 'cold', name: 'Common Cold', color: '#ffafcc', icon: 'Thermometer' },
  { id: 'rejection', name: 'Rejection', color: '#a2d2ff', icon: 'XCircle' },
  { id: 'silly-google', name: 'Silly Google Search', color: '#ffd60a', icon: 'Search' },
  { id: 'oops', name: 'Social Awkwardness', color: '#bdb2ff', icon: 'UserX' },
];


import React from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { motion } from 'framer-motion';
import type { Category, TrackerEvent } from '../types';

interface CalendarGridProps {
    days: Date[];
    events: TrackerEvent[];
    categories: Category[];
    currentDate: Date;
    onSelectDay: (day: Date) => void;
    getDayColor: (day: Date) => string;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    days,
    events,
    categories,
    currentDate,
    onSelectDay,
    getDayColor
}) => {
    return (
        <>
            <div className="calendar-grid-header">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="weekday-label">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {days.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.timestamp), day));
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectDay(day)}
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                            style={{ background: getDayColor(day) }}
                        >
                            <span style={{ fontSize: '0.85rem', fontWeight: '900' }}>{format(day, 'd')}</span>
                            {dayEvents.length > 0 && (
                                <div className="event-dots">
                                    {dayEvents.slice(0, 4).map((e) => (
                                        <div
                                            key={e.id}
                                            className="event-dot"
                                            style={{ background: categories.find(c => c.id === e.categoryId)?.color || 'black' }}
                                        />
                                    ))}
                                </div>
                            )}
                            {dayEvents.length > 0 && (
                                <div className="day-tooltip">
                                    {dayEvents.length} side-quest{dayEvents.length > 1 ? 's' : ''}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
};

export default CalendarGrid;

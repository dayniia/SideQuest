import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TrackerEvent, type Category } from './types';
import { format, differenceInDays } from 'date-fns';
import * as Icons from 'lucide-react';

interface WrappedProps {
    events: TrackerEvent[];
    categories: Category[];
    onClose: () => void;
}

const Wrapped: React.FC<WrappedProps> = ({ events, categories, onClose }) => {
    const [slide, setSlide] = useState(0);

    const stats = useMemo(() => {
        if (events.length === 0) return null;

        // 1. Peak Hour
        const hours = events.map(e => new Date(e.timestamp).getHours());
        const hourCounts = hours.reduce((acc, h) => (acc[h] = (acc[h] || 0) + 1, acc), {} as Record<number, number>);
        const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0];

        // 2. Weirdest Category (Most frequent)
        const catCounts = events.reduce((acc, e) => (acc[e.categoryId] = (acc[e.categoryId] || 0) + 1, acc), {} as Record<string, number>);
        const topCatId = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];
        const topCat = categories.find(c => c.id === topCatId);

        // 3. Longest Quiet Streak
        const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
        let maxStreak = 0;
        for (let i = 1; i < sortedEvents.length; i++) {
            const diff = differenceInDays(new Date(sortedEvents[i].timestamp), new Date(sortedEvents[i - 1].timestamp));
            if (diff > maxStreak) maxStreak = diff;
        }

        // 4. Best Day
        const days = events.map(e => format(new Date(e.timestamp), 'yyyy-MM-dd'));
        const dayCounts = days.reduce((acc, d) => (acc[d] = (acc[d] || 0) + 1, acc), {} as Record<string, number>);
        const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0];

        return { peakHour, topCat, maxStreak, topDay, total: events.length, catCounts };
    }, [events, categories]);

    if (!stats) return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '40px', textAlign: 'center' }}>
            <div>
                <h2>Not enough quests yet!</h2>
                <p>Go embark on some side quests first.</p>
                <button onClick={onClose} style={{ marginTop: '20px', background: 'white', color: 'black' }}>Go back</button>
            </div>
        </div>
    );

    const slides = [
        {
            bg: '#ffafcc',
            icon: 'Heart',
            text: 'You were busy exploring this year.',
            sub: `You logged ${stats.total} quests. Each one a tiny step in your journey.`
        },
        {
            bg: '#a2d2ff',
            icon: 'Clock',
            text: `Your peak hour of adventure?`,
            sub: `${stats.peakHour}:00. The world was sleeping, but you were on a quest.`
        },
        {
            bg: '#ffd60a',
            icon: 'Calendar',
            text: `You went ${stats.maxStreak} days being "Normal".`,
            sub: `That's your longest quiet streak. We missed the chaos.`
        },
        {
            bg: stats.topCat?.color || '#bdb2ff',
            icon: stats.topCat?.icon || 'Award',
            text: `The ${stats.topCat?.name} Champion.`,
            sub: `You logged this ${stats.catCounts[stats.topCat?.id || '']} times. It's basically your brand now.`
        },
        {
            bg: '#1a1a1a',
            textColor: '#fff',
            icon: 'Sparkles',
            text: 'Stay adventurous, 2026.',
            sub: 'See you next year for the next chapter.'
        }
    ];


    return (
        <div style={{ position: 'fixed', inset: 0, background: slides[slide].bg, color: slides[slide].textColor || '#2d2d2d', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', transition: 'background 0.5s ease' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', boxShadow: 'none', color: 'inherit' }}>Skip</button>

            <AnimatePresence mode="wait">
                <motion.div
                    key={slide}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.4, type: 'spring' }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    {(() => {
                        const IconComp = (Icons as any)[slides[slide].icon];
                        return IconComp ? <IconComp size={80} style={{ marginBottom: '30px', opacity: 0.9 }} /> : null;
                    })()}
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>{slides[slide].text}</h2>
                    <p style={{ fontSize: '1.8rem', opacity: 0.9 }}>{slides[slide].sub}</p>
                </motion.div>
            </AnimatePresence>

            <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '8px' }}>
                {slides.map((_, i) => (
                    <div key={i} style={{ width: '40px', height: '4px', background: i <= slide ? 'currentColor' : 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
                ))}
            </div>

            <button
                style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', boxShadow: 'none', width: '100%', height: '100%', cursor: 'pointer' }}
                onClick={() => slide < slides.length - 1 ? setSlide(slide + 1) : onClose()}
            />
        </div>
    );
};

export default Wrapped;

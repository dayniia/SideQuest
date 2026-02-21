import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TrackerEvent, type Category } from './types';
import { format, isSameMonth } from 'date-fns';
import * as Icons from 'lucide-react';

interface WrappedProps {
    events: TrackerEvent[];
    categories: Category[];
    onClose: () => void;
    month?: Date; // Optional month for monthly wrapped
}

const Wrapped: React.FC<WrappedProps> = ({ events, categories, onClose, month }) => {
    const [slide, setSlide] = useState(0);

    const filteredEvents = useMemo(() => {
        if (!month) return events;
        return events.filter(e => isSameMonth(new Date(e.timestamp), month));
    }, [events, month]);

    const stats = useMemo(() => {
        if (filteredEvents.length === 0) return null;

        // 1. Peak Day of Week
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekdayCounts = filteredEvents.map(e => new Date(e.timestamp).getDay())
            .reduce((acc, d) => (acc[d] = (acc[d] || 0) + 1, acc), {} as Record<number, number>);
        const peakDayIndex = Number(Object.entries(weekdayCounts).sort((a, b) => b[1] - a[1])[0][0]);
        const peakDayName = dayNames[peakDayIndex];

        // 2. Peak Month (Yearly only)
        let peakMonthName = '';
        if (!month) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthCounts = filteredEvents.map(e => new Date(e.timestamp).getMonth())
                .reduce((acc, m) => (acc[m] = (acc[m] || 0) + 1, acc), {} as Record<number, number>);
            const peakMonthIndex = Number(Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0][0]);
            peakMonthName = months[peakMonthIndex];
        }

        // 3. Most Chaotic Category
        const catCounts = filteredEvents.reduce((acc, e) => (acc[e.categoryId] = (acc[e.categoryId] || 0) + 1, acc), {} as Record<string, number>);
        const topCatId = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];
        const topCat = categories.find(c => c.id === topCatId);

        // 4. Character Class Title (Yearly special)
        const classTitles: Record<string, string> = {
            'solo-date': 'The Romantic Main Character',
            'rejection': 'The Resilience Master',
            'learn-new': 'The Infinite Scholar',
            'cook-recipe': 'The Culinary Pioneer',
            'oops': 'The Social Alchemist',
        };
        const characterClass = topCat ? (classTitles[topCat.id] || 'The Unpredictable Adventurer') : 'The Newcomer';

        // 5. Random funny summary based on notes
        const notes = filteredEvents.filter(e => e.note).map(e => e.note);
        const funnyVibe = notes.length > 0
            ? notes[Math.floor(Math.random() * notes.length)]
            : "The quest log is silent... the next legendary chapter is still waiting to be written.";

        return { peakDayName, peakMonthName, topCat, characterClass, funnyVibe, total: filteredEvents.length, catCounts };
    }, [filteredEvents, categories, month]);

    if (!stats) return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '40px', textAlign: 'center' }}>
            <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>The archive is empty.</h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>No side-quests logged for {month ? format(month, 'MMMM') : 'this year'}. Keep it weird!</p>
                <button onClick={onClose} style={{ marginTop: '30px', background: 'white', color: 'black', padding: '12px 30px', borderRadius: '12px', fontWeight: 'bold' }}>Close</button>
            </div>
        </div>
    );

    const monthName = month ? format(month, 'MMMM') : 'this year';

    const slides = month ? [
        // MONTHLY SLIDES
        {
            bg: '#ffafcc',
            icon: 'Zap',
            text: format(month, 'MMMM yyyy'),
            sub: `You survived ${monthName} with ${stats.total} total side-quests logged. Impressive.`
        },
        {
            bg: '#caffbf',
            icon: 'Dizzy',
            text: `Main character energy was highest on ${stats.peakDayName}s.`,
            sub: `That's when the plot armor was thickest.`
        },
        {
            bg: '#ffd60a',
            icon: 'Ghost',
            text: `The "${stats.topCat?.name}" incident.`,
            sub: `You did this ${stats.catCounts[stats.topCat?.id || '']} times. Are you okay? Should we call someone?`
        },
        {
            bg: '#bdb2ff',
            icon: 'Smile',
            text: `A message for your future self:`,
            sub: `"${stats.funnyVibe}"`
        },
        {
            bg: '#1a1a1a',
            textColor: '#fff',
            icon: 'Moon',
            text: `Archive closed.`,
            sub: `Go do something you won't regret later (but definitely log it).`
        }
    ] : [
        // YEARLY SLIDES
        {
            bg: '#ffafcc',
            icon: 'Zap',
            text: format(new Date(), 'yyyy'),
            sub: `365 days. ${stats.total} side-quests. One incredible timeline.`
        },
        {
            bg: '#caffbf',
            icon: 'Sparkles',
            text: `The Season of Chaos was ${stats.peakMonthName}.`,
            sub: `That's when your quest log was overflowing.`
        },
        {
            bg: '#ffd60a',
            icon: 'Sword',
            text: `Unlocked Class: ${stats.characterClass}.`,
            sub: `Your dedication to "${stats.topCat?.name}" defined your year.`
        },
        {
            bg: '#bdb2ff',
            icon: 'Compass',
            text: `A transmission to your future self from the past year:`,
            sub: `"${stats.funnyVibe}"`
        },
        {
            bg: '#1a1a1a',
            textColor: '#fff',
            icon: 'Moon',
            text: `Yearly Archive closed.`,
            sub: `Ready for Level ${Number(format(new Date(), 'yyyy')) + 1}?`
        }
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, background: slides[slide].bg, color: slides[slide].textColor || '#2d2d2d', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', transition: 'background 0.5s ease' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', boxShadow: 'none', color: 'inherit', padding: '8px 16px', borderRadius: '20px', zIndex: 1001, cursor: 'pointer' }}>Exit</button>

            <AnimatePresence mode="wait">
                <motion.div
                    key={slide}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', width: '100%' }}
                >
                    {(() => {
                        const IconComp = (Icons as any)[slides[slide].icon];
                        return IconComp ? <IconComp size={window.innerWidth < 600 ? 80 : 120} style={{ marginBottom: '30px', opacity: 0.8 }} /> : null;
                    })()}
                    <h2 style={{ fontSize: 'min(3.5rem, 12vw)', marginBottom: '15px', fontWeight: '900', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{slides[slide].text}</h2>
                    <p style={{ fontSize: 'min(1.5rem, 6vw)', opacity: 0.9, fontWeight: '500', fontStyle: slide === 3 ? 'italic' : 'normal' }}>{slides[slide].sub}</p>
                </motion.div>
            </AnimatePresence>

            <div style={{ position: 'absolute', bottom: '60px', display: 'flex', gap: '8px' }}>
                {slides.map((_, i) => (
                    <div key={i} style={{ width: '40px', height: '6px', background: i <= slide ? 'currentColor' : 'rgba(0,0,0,0.1)', borderRadius: '3px', transition: 'all 0.3s' }} />
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

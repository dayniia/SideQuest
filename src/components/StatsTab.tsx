import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { isSameMonth } from 'date-fns';
import type { Category, TrackerEvent } from '../types';

interface StatsTabProps {
    events: TrackerEvent[];
    categories: Category[];
    currentDate: Date;
    onMonthlyWrapped: () => void;
    onYearlyWrapped: () => void;
}

const StatsTab: React.FC<StatsTabProps> = ({ events, categories, currentDate, onMonthlyWrapped, onYearlyWrapped }) => {
    const now = new Date();

    const yearlyTotal = useMemo(() =>
        events.filter(e => new Date(e.timestamp).getFullYear() === now.getFullYear()).length,
        [events]
    );

    const monthlyTotal = useMemo(() =>
        events.filter(e => isSameMonth(new Date(e.timestamp), currentDate)).length,
        [events, currentDate]
    );

    const topCategory = useMemo(() => {
        const counts: Record<string, number> = {};
        events.forEach(e => { counts[e.categoryId] = (counts[e.categoryId] || 0) + 1; });
        const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
        return categories.find(c => c.id === topId);
    }, [events, categories]);

    const statCards = [
        {
            icon: <TrendingUp size={20} />,
            label: 'This Month',
            value: monthlyTotal,
            unit: 'quests',
            color: 'var(--purple)',
        },
        {
            icon: <Trophy size={20} />,
            label: 'This Year',
            value: yearlyTotal,
            unit: 'total',
            color: 'var(--yellow)',
        },
    ];

    return (
        <div className="stats-tab">
            <h2 className="stats-title">Your Stats ✨</h2>

            <div className="stats-grid">
                {statCards.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="stat-card card"
                    >
                        <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-unit">{s.unit}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {topCategory && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="card top-cat-card"
                    style={{ borderColor: topCategory.color, boxShadow: `3px 3px 0px ${topCategory.color}` }}
                >
                    <span className="top-cat-label">⭐ Most Logged Quest</span>
                    <span className="top-cat-name" style={{ background: topCategory.color }}>
                        {topCategory.name}
                    </span>
                </motion.div>
            )}

            <div className="wrapped-buttons">
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onMonthlyWrapped}
                    className="wrapped-btn"
                    style={{ background: 'var(--purple)' }}
                >
                    <Sparkles size={16} /> Monthly Wrapped
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onYearlyWrapped}
                    className="wrapped-btn"
                    style={{ background: 'var(--yellow)' }}
                >
                    <Sparkles size={16} /> Yearly Wrapped
                </motion.button>
            </div>
        </div>
    );
};

export default StatsTab;

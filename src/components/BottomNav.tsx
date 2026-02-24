import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, BarChart2, Settings2 } from 'lucide-react';

export type Tab = 'calendar' | 'stats' | 'settings';

interface BottomNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; Icon: React.FC<{ size?: number }> }[] = [
    { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
    { id: 'stats', label: 'Stats', Icon: BarChart2 },
    { id: 'settings', label: 'Settings', Icon: Settings2 },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="bottom-nav">
            {TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                    <button
                        key={id}
                        className={`bottom-nav-tab ${isActive ? 'active' : ''}`}
                        onClick={() => onTabChange(id)}
                        style={{ border: 'none', boxShadow: 'none' }}
                    >
                        <motion.div
                            animate={{ scale: isActive ? 1.15 : 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="bottom-nav-icon"
                        >
                            <Icon size={22} />
                        </motion.div>
                        <span className="bottom-nav-label">{label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="active-tab-pill"
                                className="bottom-nav-pill"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;

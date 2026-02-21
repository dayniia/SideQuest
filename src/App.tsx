import React, { useState, useEffect, useMemo } from 'react';
import { type Category, type TrackerEvent, DEFAULT_CATEGORIES } from './types';
import { format, isSameDay, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Download, Sparkles, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Wrapped from './Wrapped';
import logo from './assets/logo.png';

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('yt_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [events, setEvents] = useState<TrackerEvent[]>(() => {
    const saved = localStorage.getItem('yt_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [showWrapped, setShowWrapped] = useState(false);
  const [isMonthlyWrapped, setIsMonthlyWrapped] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#ffafcc');
  const [newCatIcon, setNewCatIcon] = useState('Circle');
  const [currentDate, setCurrentDate] = useState(new Date());

  const QUEST_ICONS = ['Circle', 'Heart', 'Star', 'Ghost', 'Coffee', 'Zap', 'Moon', 'Sun', 'Cloud', 'Trash2', 'Smile', 'Frown', 'Dizzy', 'Bomb', 'Flame'];

  useEffect(() => {
    localStorage.setItem('yt_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('yt_events', JSON.stringify(events));
  }, [events]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const addEvent = () => {
    if (!selectedDay || selectedCatIds.length === 0) return;
    const timestamp = selectedDay.getTime();

    const newEvents: TrackerEvent[] = selectedCatIds.map(catId => ({
      id: Math.random().toString(36).substring(2, 11),
      categoryId: catId,
      timestamp,
      note: newNote.trim() || undefined
    }));

    setEvents(prev => [...prev, ...newEvents]);
    setNewNote('');
    setSelectedCatIds([]);
    setShowAddModal(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = () => {
    const newCat: Category = {
      id: Math.random().toString(36).substring(2, 11),
      name: newCatName.trim(),
      color: newCatColor,
      icon: newCatIcon
    };
    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
    setNewCatIcon('Circle');
    setShowCatModal(false);
  };

  const getDayColor = (day: Date) => {
    const dayEvents = events.filter(e => isSameDay(new Date(e.timestamp), day));
    if (dayEvents.length === 0) return 'transparent';
    if (dayEvents.length === 1) {
      return categories.find(c => c.id === dayEvents[0].categoryId)?.color || '#eee';
    }
    const uniqueCats = Array.from(new Set(dayEvents.map(e => e.categoryId)));
    const catColors = uniqueCats.map(cid => categories.find(c => c.id === cid)?.color || '#eee');
    if (catColors.length === 2) {
      return `linear-gradient(45deg, ${catColors[0]} 50%, ${catColors[1]} 50%)`;
    }
    const step = 100 / catColors.length;
    let gradient = `conic-gradient(`;
    catColors.forEach((color, i) => {
      gradient += `${color} ${i * step}% ${(i + 1) * step}%${i === catColors.length - 1 ? '' : ','}`;
    });
    gradient += `)`;
    return gradient;
  };

  const handleDownload = () => {
    const data = { categories, events };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sidequest-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  const toggleCategory = (catId: string) => {
    setSelectedCatIds(prev =>
      prev.includes(catId)
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }} className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="logo-section">
          <img src={logo} alt="SideQuest Logo" style={{ width: '60px', height: '60px', borderRadius: '12px', border: '2px solid var(--border)', boxShadow: 'var(--shadow)', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              SideQuest <Sparkles className="sparkle-icon" size={24} />
            </h1>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Tracking the beautifully unhinged side-quests</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }} className="header-actions">
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> <span className="btn-text">Backup</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsMonthlyWrapped(false); setShowWrapped(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--yellow)' }}
          >
            <Sparkles size={18} /> <span className="btn-text">Yearly Wrapped</span>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {showWrapped && (
          <Wrapped
            events={events}
            categories={categories}
            onClose={() => setShowWrapped(false)}
            month={isMonthlyWrapped ? currentDate : undefined}
          />
        )}
      </AnimatePresence>

      <main>
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="calendar-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <button onClick={prevMonth} style={{ padding: '6px' }}><ChevronLeft size={18} /></button>
              <h2 style={{ fontSize: '1.4rem', minWidth: '150px', textAlign: 'center' }}>{format(currentDate, 'MMMM yyyy')}</h2>
              <button onClick={nextMonth} style={{ padding: '6px' }}><ChevronRight size={18} /></button>
            </div>
            <button
              onClick={() => { setIsMonthlyWrapped(true); setShowWrapped(true); }}
              className="monthly-wrapped-btn"
              style={{ background: 'var(--purple)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <Sparkles size={14} /> <span className="btn-text">Monthly Wrapped</span>
            </button>
          </div>
          <div className="categories-list">
            {categories.map(cat => {
              const IconComponent = (Icons as any)[cat.icon || 'Circle'];
              return (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: cat.color + '33', padding: '3px 8px', borderRadius: '15px', border: `2px solid ${cat.color}` }}>
                  {IconComponent && <IconComponent size={10} />}
                  {cat.name}
                </div>
              );
            })}
            <button
              onClick={() => setShowCatModal(true)}
              style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} /> New
            </button>
          </div>

          <div className="calendar-grid-header">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="weekday-label">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, i) => {
              const dayEvents = events.filter(e => isSameDay(new Date(e.timestamp), day));
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedDay(day); setShowAddModal(true); setSelectedCatIds([]); }}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                  style={{ background: getDayColor(day) }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: '900' }}>{format(day, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="event-dots">
                      {dayEvents.slice(0, 4).map((e) => (
                        <div key={e.id} className="event-dot" style={{ background: categories.find(c => c.id === e.categoryId)?.color || 'black' }} />
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
        </div>

        <AnimatePresence>
          {showAddModal && selectedDay && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                className="card" style={{ width: '100%', maxWidth: '500px', cursor: 'default' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem' }}>{format(selectedDay, 'MMMM do, yyyy')}</h3>
                  <button onClick={() => setShowAddModal(false)} style={{ padding: '4px 12px', fontSize: '1.2rem' }}>&times;</button>
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged Side-Quests</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {events.filter(e => isSameDay(new Date(e.timestamp), selectedDay)).length === 0 && (
                      <p style={{ fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.5, padding: '15px', textAlign: 'center', border: '2px dashed #ddd', borderRadius: '8px' }}>Quiet day...</p>
                    )}
                    {events.filter(e => isSameDay(new Date(e.timestamp), selectedDay)).map(event => {
                      const cat = categories.find(c => c.id === event.categoryId);
                      return (
                        <div key={event.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '2px solid var(--border)', borderRadius: '10px', background: cat?.color || '#eee', boxShadow: '2px 2px 0px var(--border)' }}>
                          <div><span style={{ fontWeight: 'bold' }}>{cat?.name}</span>{event.note && <p style={{ fontSize: '0.85rem' }}>"{event.note}"</p>}</div>
                          <button onClick={() => deleteEvent(event.id)} style={{ padding: '6px', border: 'none', background: 'white', borderRadius: '6px' }}><Trash2 size={16} color="#ff4d4d" /></button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                  <h4 style={{ marginBottom: '15px' }}>Log New Quest(s)</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        style={{
                          background: selectedCatIds.includes(cat.id) ? cat.color : 'white',
                          fontSize: '0.85rem',
                          border: selectedCatIds.includes(cat.id) ? '2px solid black' : '2px solid var(--border)'
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCatModal(true)}
                      style={{
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'transparent',
                        border: '2px dashed var(--border)'
                      }}
                    >
                      <Plus size={14} /> New
                    </button>
                  </div>
                  <textarea value={newNote} onChange={e => setNewNote(e.target.value)} style={{ width: '100%', height: '80px', borderRadius: '10px', border: '2px solid var(--border)', padding: '12px', marginBottom: '15px', fontFamily: 'inherit' }} placeholder="Add a note for these quests..." />
                  <button onClick={addEvent} disabled={selectedCatIds.length === 0} style={{ width: '100%', background: selectedCatIds.length > 0 ? 'black' : '#ccc', color: 'white', padding: '12px', fontWeight: 'bold' }}>LOG {selectedCatIds.length > 0 ? (selectedCatIds.length > 1 ? `${selectedCatIds.length} QUESTS` : 'QUEST') : 'QUEST'}!</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCatModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
              onClick={() => setShowCatModal(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                className="card" style={{ width: '100%', maxWidth: '450px', cursor: 'default' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                  <h3>New Category</h3>
                  <button onClick={() => setShowCatModal(false)}>&times;</button>
                </div>
                <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid var(--border)', marginBottom: '20px' }} />
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['#ffafcc', '#a2d2ff', '#ffd60a', '#caffbf', '#bdb2ff', '#ff9f1c', '#2ec4b6'].map(color => (
                      <div key={color} onClick={() => setNewCatColor(color)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, border: '2px solid var(--border)', cursor: 'pointer', transform: newCatColor === color ? 'translate(-2px, -2px)' : 'none' }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '25px', background: '#f5f5f5', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {QUEST_ICONS.map(iconName => {
                      const IconComp = (Icons as any)[iconName];
                      return <div key={iconName} onClick={() => setNewCatIcon(iconName)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: newCatIcon === iconName ? 'black' : 'white', color: newCatIcon === iconName ? 'white' : 'black', border: '2px solid var(--border)', cursor: 'pointer' }}>{IconComp && <IconComp size={18} />}</div>;
                    })}
                  </div>
                </div>
                <button onClick={addCategory} style={{ width: '100%', background: 'black', color: 'white', padding: '12px', fontWeight: 'bold' }}>CREATE</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main >
    </div >
  );
};

export default App;

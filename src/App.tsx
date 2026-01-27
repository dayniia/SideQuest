import React, { useState, useEffect, useMemo } from 'react';
import { type Category, type TrackerEvent, DEFAULT_CATEGORIES } from './types';
import { format, isSameDay, startOfYear, endOfYear, eachDayOfInterval, getDay, isFirstDayOfMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Download, Sparkles, Trash2, Plus } from 'lucide-react';
import Wrapped from './Wrapped';

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
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [showWrapped, setShowWrapped] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#ffafcc');
  const [newCatIcon, setNewCatIcon] = useState('Circle');

  const QUEST_ICONS = ['Circle', 'Heart', 'Star', 'Ghost', 'Coffee', 'Zap', 'Moon', 'Sun', 'Cloud', 'Trash2', 'Smile', 'Frown', 'Dizzy', 'Bomb', 'Flame'];

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    localStorage.setItem('yt_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('yt_events', JSON.stringify(events));
  }, [events]);

  const daysInYear = useMemo(() => {
    const start = startOfYear(new Date(currentYear, 0, 1));
    const end = endOfYear(new Date(currentYear, 11, 31));
    return eachDayOfInterval({ start, end });
  }, [currentYear]);

  const firstDayOfYear = useMemo(() => startOfYear(new Date(currentYear, 0, 1)), [currentYear]);
  const firstDayOffset = (getDay(firstDayOfYear) + 6) % 7; // Mon=0, Sun=6

  const monthLabels = useMemo(() => {
    const labels: { name: string; col: number }[] = [];
    daysInYear.forEach((day, i) => {
      if (isFirstDayOfMonth(day)) {
        const col = Math.floor((i + firstDayOffset) / 7);
        labels.push({ name: format(day, 'MMM'), col });
      }
    });
    return labels;
  }, [daysInYear, firstDayOffset]);

  const addEvent = () => {
    if (!selectedDay || !selectedCatId) return;

    const timestamp = selectedDay.getTime();

    const newEvent: TrackerEvent = {
      id: Math.random().toString(36).substring(2, 11),
      categoryId: selectedCatId,
      timestamp,
      note: newNote.trim() || undefined
    };

    setEvents(prev => [...prev, newEvent]);
    setNewNote('');
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
    a.download = `yearly-trackable-${currentYear}.json`;
    a.click();
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>SideQuest <Sparkles style={{ display: 'inline' }} /></h1>
          <p style={{ opacity: 0.7 }}>Tracking the beautifully unhinged side-quests of {currentYear}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Backup
          </button>
          <motion.button
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => setShowWrapped(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--yellow)' }}
          >
            <Sparkles size={18} /> Wrapped {currentYear}
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {showWrapped && (
          <Wrapped
            events={events}
            categories={categories}
            onClose={() => setShowWrapped(false)}
          />
        )}
      </AnimatePresence>

      <main>
        <div className="card" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem' }}>The Grid</h2>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const IconComponent = (Icons as any)[cat.icon || 'Circle'];
                return (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', background: cat.color + '33', padding: '2px 8px', borderRadius: '20px', border: `1px solid ${cat.color}` }}>
                    {IconComponent && <IconComponent size={12} />}
                    {cat.name}
                  </div>
                );
              })}
              <button
                onClick={() => setShowCatModal(true)}
                style={{ padding: '2px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> New
              </button>
            </div>
          </div>

          <div className="calendar-scroll-wrapper" style={{
            overflowX: 'auto',
            padding: '20px 0',
            cursor: 'grab',
            WebkitOverflowScrolling: 'touch'
          }}>
            <div style={{ display: 'flex', gap: '10px', minWidth: 'max-content', padding: '0 10px' }}>
              <div style={{
                display: 'grid',
                gridTemplateRows: 'repeat(7, 22px)',
                gap: '4px',
                paddingTop: '24px',
                fontSize: '0.65rem',
                opacity: 0.4,
                textAlign: 'right',
                width: '30px',
                fontWeight: 'bold',
                userSelect: 'none'
              }}>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ position: 'relative', height: '20px', marginBottom: '4px' }}>
                  {monthLabels.map((lbl, i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      left: `${lbl.col * 26}px`,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      opacity: 0.6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {lbl.name}
                    </div>
                  ))}
                </div>

                <div
                  className="grid-container"
                  style={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(7, 22px)',
                    gridAutoFlow: 'column',
                    gridAutoColumns: '22px',
                    gap: '4px',
                    padding: 0,
                    margin: 0
                  }}
                >
                  {daysInYear.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.timestamp), day));
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        className={`day-square ${isSameDay(day, new Date()) ? 'active' : ''}`}
                        style={{
                          background: getDayColor(day),
                          cursor: 'pointer',
                          gridRow: (getDay(day) === 0 ? 7 : getDay(day)),
                          border: isSameDay(day, new Date()) ? '2px solid black' : '1px solid rgba(0,0,0,0.05)'
                        }}
                        onClick={() => {
                          setSelectedDay(day);
                          setShowAddModal(true);
                        }}
                      >
                        {dayEvents.length > 0 && (
                          <div className="day-tooltip">
                            <strong>{format(day, 'MMM d')}</strong>: {dayEvents.length} quest{dayEvents.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAddModal && selectedDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.95 }}
                className="card"
                style={{ width: '100%', maxWidth: '500px', cursor: 'default' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>{format(selectedDay, 'MMMM do, yyyy')}</h3>
                  <button onClick={() => setShowAddModal(false)} style={{ padding: '4px 8px' }}>X</button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '0.9rem', opacity: 0.7 }}>Completed Quests:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {events.filter(e => isSameDay(new Date(e.timestamp), selectedDay)).length === 0 && (
                      <p style={{ fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.5 }}>Quiet day... no side-quests logged.</p>
                    )}
                    {events.filter(e => isSameDay(new Date(e.timestamp), selectedDay)).map(event => {
                      const cat = categories.find(c => c.id === event.categoryId);
                      return (
                        <div key={event.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', border: '1px solid #eee', borderRadius: '6px', background: (cat?.color || '#eee') + '22' }}>
                          <div>
                            <span style={{ fontWeight: 'bold' }}>{cat?.name}</span>
                            {event.note && <p style={{ fontSize: '0.85rem' }}>"{event.note}"</p>}
                          </div>
                          <button onClick={() => deleteEvent(event.id)} style={{ padding: '2px', border: 'none', background: 'transparent', boxShadow: 'none' }}><Trash2 size={14} color="#ff4d4d" /></button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Add New Side-Quest</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        style={{
                          background: selectedCatId === cat.id ? cat.color : 'white',
                          borderColor: selectedCatId === cat.id ? 'var(--border)' : '#ddd',
                          fontSize: '0.85rem'
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Describe your quest (optional)..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    style={{ width: '100%', height: '80px', borderRadius: '8px', border: '2px solid var(--border)', padding: '10px', marginBottom: '15px', fontFamily: 'inherit' }}
                  />
                  <button onClick={addEvent} style={{ width: '100%', background: 'black', color: 'white', padding: '12px' }}>
                    Log this quest!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showCatModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
              onClick={() => setShowCatModal(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.95 }}
                className="card"
                style={{ width: '100%', maxWidth: '400px', cursor: 'default' }}
                onClick={e => e.stopPropagation()}
              >
                <h3 style={{ marginBottom: '20px' }}>What else are we tracking?</h3>
                <input
                  type="text"
                  placeholder="Category name (e.g. 'Coffee Spills')"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--border)', marginBottom: '15px', fontFamily: 'inherit' }}
                />
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Choose a vibe:</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['#ffafcc', '#a2d2ff', '#ffd60a', '#caffbf', '#bdb2ff', '#ff9f1c', '#2ec4b6'].map(color => (
                      <div
                        key={color}
                        onClick={() => setNewCatColor(color)}
                        style={{ width: '30px', height: '30px', borderRadius: '6px', background: color, border: newCatColor === color ? '3px solid black' : '1px solid #ddd', cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Choose an icon:</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
                    {QUEST_ICONS.map(iconName => {
                      const IconComp = (Icons as any)[iconName];
                      return (
                        <div
                          key={iconName}
                          onClick={() => setNewCatIcon(iconName)}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            background: newCatIcon === iconName ? 'black' : 'transparent',
                            color: newCatIcon === iconName ? 'white' : 'black',
                            cursor: 'pointer',
                            border: '1px solid #ddd'
                          }}
                        >
                          {IconComp && <IconComp size={16} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button onClick={addCategory} style={{ width: '100%', background: 'black', color: 'white' }}>Add Category</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

import React from 'react';
import { format, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Category, TrackerEvent } from '../types';

interface ModalsProps {
    showAddModal: boolean;
    selectedDay: Date | null;
    events: TrackerEvent[];
    categories: Category[];
    selectedCatIds: string[];
    newNote: string;
    QUEST_ICONS: string[];
    showCatModal: boolean;
    newCatName: string;
    newCatColor: string;
    newCatIcon: string;
    showConfirm: { message: string; onConfirm: () => void } | null;

    onCloseAddModal: () => void;
    onToggleCategory: (id: string) => void;
    onSetNote: (note: string) => void;
    onLogQuest: () => void;
    onDeleteEvent: (id: string) => void;
    onShowCatModal: () => void;
    onCloseCatModal: () => void;
    onSetCatName: (name: string) => void;
    onSetCatColor: (color: string) => void;
    onSetCatIcon: (icon: string) => void;
    onAddCategory: () => void;
    onCloseConfirm: () => void;
}

const Modals: React.FC<ModalsProps> = (props) => {
    const {
        showAddModal, selectedDay, events, categories, selectedCatIds, newNote,
        QUEST_ICONS, showCatModal, newCatName, newCatColor, newCatIcon, showConfirm,
        onCloseAddModal, onToggleCategory, onSetNote, onLogQuest, onDeleteEvent,
        onShowCatModal, onCloseCatModal, onSetCatName, onSetCatColor, onSetCatIcon,
        onAddCategory, onCloseConfirm
    } = props;

    return (
        <>
            <AnimatePresence>
                {showAddModal && selectedDay && (
                    <div className="modal-overlay" onClick={onCloseAddModal}>
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                            className="card" style={{ width: '100%', maxWidth: '500px', cursor: 'default' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex-between mb-24">
                                <h3 style={{ fontSize: '1.5rem' }}>{format(selectedDay, 'MMMM do, yyyy')}</h3>
                                <button onClick={onCloseAddModal} style={{ padding: '4px 12px', fontSize: '1.2rem' }}>&times;</button>
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
                                            <div key={event.id} className="flex-between" style={{ padding: '12px', border: '2px solid var(--border)', borderRadius: '10px', background: cat?.color || '#eee', boxShadow: '2px 2px 0px var(--border)' }}>
                                                <div><span style={{ fontWeight: 'bold' }}>{cat?.name}</span>{event.note && <p style={{ fontSize: '0.85rem' }}>"{event.note}"</p>}</div>
                                                <button onClick={() => onDeleteEvent(event.id)} style={{ padding: '6px', border: 'none', background: 'white', borderRadius: '6px' }}><Trash2 size={16} color="#ff4d4d" /></button>
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
                                            onClick={() => onToggleCategory(cat.id)}
                                            style={{
                                                background: selectedCatIds.includes(cat.id) ? cat.color : 'white',
                                                fontSize: '0.85rem',
                                                border: selectedCatIds.includes(cat.id) ? '2px solid black' : '2px solid var(--border)'
                                            }}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                    <button onClick={onShowCatModal} className="flex-center gap-sm" style={{ fontSize: '0.85rem', background: 'transparent', border: '2px dashed var(--border)' }}>
                                        <Plus size={14} /> New
                                    </button>
                                </div>
                                <textarea value={newNote} onChange={e => onSetNote(e.target.value)} style={{ width: '100%', height: '80px', borderRadius: '10px', border: '2px solid var(--border)', padding: '12px', marginBottom: '15px', fontFamily: 'inherit' }} placeholder="Add a note for these quests..." />
                                <button onClick={onLogQuest} disabled={selectedCatIds.length === 0} style={{ width: '100%', background: selectedCatIds.length > 0 ? 'black' : '#ccc', color: 'white', padding: '12px', fontWeight: 'bold' }}>LOG {selectedCatIds.length > 0 ? (selectedCatIds.length > 1 ? `${selectedCatIds.length} QUESTS` : 'QUEST') : 'QUEST'}!</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCatModal && (
                    <div className="modal-overlay" onClick={onCloseCatModal}>
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                            className="card" style={{ width: '100%', maxWidth: '450px', cursor: 'default' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex-between mb-24">
                                <h3>New Category</h3>
                                <button onClick={onCloseCatModal}>&times;</button>
                            </div>
                            <input type="text" value={newCatName} onChange={e => onSetCatName(e.target.value)} placeholder="Category Name" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid var(--border)', marginBottom: '20px' }} />
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['#ffafcc', '#a2d2ff', '#ffd60a', '#caffbf', '#bdb2ff', '#ff9f1c', '#2ec4b6'].map(color => (
                                        <div key={color} onClick={() => onSetCatColor(color)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, border: '2px solid var(--border)', cursor: 'pointer', transform: newCatColor === color ? 'translate(-2px, -2px)' : 'none' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '25px', background: '#f5f5f5', padding: '12px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {QUEST_ICONS.map(iconName => {
                                        const IconComp = (Icons as any)[iconName];
                                        return <div key={iconName} onClick={() => onSetCatIcon(iconName)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: newCatIcon === iconName ? 'black' : 'white', color: newCatIcon === iconName ? 'white' : 'black', border: '2px solid var(--border)', cursor: 'pointer' }}>{IconComp && <IconComp size={18} />}</div>;
                                    })}
                                </div>
                            </div>
                            <button onClick={onAddCategory} style={{ width: '100%', background: 'black', color: 'white', padding: '12px', fontWeight: 'bold' }}>CREATE</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showConfirm && (
                    <div className="modal-overlay" onClick={onCloseConfirm}>
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                            className="card" style={{ width: '100%', maxWidth: '400px', cursor: 'default', textAlign: 'center' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ marginBottom: '20px' }}>
                                <div className="flex-center mb-24" style={{ width: '60px', height: '60px', background: '#fff5f5', borderRadius: '50%', margin: '0 auto 15px' }}>
                                    <Trash2 size={30} color="#ff4d4d" />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Are you sure?</h3>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{showConfirm.message}</p>
                            </div>
                            <div className="flex gap-md">
                                <button onClick={onCloseConfirm} style={{ flex: 1, background: '#eee', color: 'black' }}>Cancel</button>
                                <button onClick={showConfirm.onConfirm} style={{ flex: 1, background: '#ff4d4d', color: 'white', fontWeight: 'bold' }}>Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Modals;

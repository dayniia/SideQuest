import React from 'react';
import * as Icons from 'lucide-react';
import { Plus, Trash2 } from 'lucide-react';
import type { Category } from '../types';

interface CategoryBarProps {
    categories: Category[];
    onDeleteCategory: (id: string) => void;
    onShowAddCategory: () => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ categories, onDeleteCategory, onShowAddCategory }) => {
    return (
        <div className="categories-list">
            {categories.map(cat => {
                const IconComponent = (Icons as any)[cat.icon || 'Circle'];
                return (
                    <div
                        key={cat.id}
                        className="category-tag"
                        style={{
                            background: cat.color + '33',
                            borderColor: cat.color
                        }}
                    >
                        <div className="flex-center gap-sm">
                            {IconComponent && <IconComponent size={10} />}
                            {cat.name}
                        </div>
                        <button
                            onClick={() => onDeleteCategory(cat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2px',
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            <Trash2 size={10} />
                        </button>
                    </div>
                );
            })}
            <button
                onClick={onShowAddCategory}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                className="flex-center gap-sm"
            >
                <Plus size={12} /> New
            </button>
        </div>
    );
};

export default CategoryBar;

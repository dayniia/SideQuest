import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Info } from 'lucide-react';

interface SettingsTabProps {
    onDownload: () => void;
    onImport: (file: File) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onDownload, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImport(file);
        e.target.value = '';
    };

    const settingRows = [
        {
            icon: <Download size={20} />,
            title: 'Export Backup',
            description: 'Save all your quests & categories as a JSON file',
            action: onDownload,
            label: 'Export',
            color: 'var(--green)',
        },
        {
            icon: <Upload size={20} />,
            title: 'Import Backup',
            description: 'Restore from a previously exported backup file',
            action: () => fileInputRef.current?.click(),
            label: 'Import',
            color: 'var(--blue)',
        },
    ];

    return (
        <div className="settings-tab">
            <h2 className="stats-title">Settings ⚙️</h2>

            <div className="settings-group">
                <p className="settings-group-label">Data</p>
                {settingRows.map((row, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="settings-row card"
                    >
                        <div className="settings-row-info">
                            <div className="settings-row-icon" style={{ background: row.color }}>{row.icon}</div>
                            <div>
                                <div className="settings-row-title">{row.title}</div>
                                <div className="settings-row-desc">{row.description}</div>
                            </div>
                        </div>
                        <button onClick={row.action} className="settings-action-btn" style={{ background: row.color }}>
                            {row.label}
                        </button>
                    </motion.div>
                ))}
            </div>

            <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="app-version-row"
            >
                <Info size={14} />
                <span>SideQuest v1.2.0</span>
            </motion.div>
        </div>
    );
};

export default SettingsTab;

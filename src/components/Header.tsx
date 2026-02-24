import { Sparkles, Download, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';

interface HeaderProps {
    logo: string;
    onDownload: () => void;
    onShowYearlyWrapped: () => void;
}

const Header: React.FC<HeaderProps> = ({ logo, onDownload, onShowYearlyWrapped }) => {
    return (
        <header className="app-header flex-between gap-md mb-24 flex-wrap">
            <div className="logo-section flex-center gap-md">
                <img src={logo} alt="SideQuest Logo" className="header-logo-img" />
                <div>
                    <h1 className="flex-center gap-sm">
                        SideQuest <Sparkles className="sparkle-icon" size={24} />
                    </h1>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Tracking the beautifully unhinged side-quests</p>
                </div>
            </div>
            <div className="header-actions flex gap-md">
                {!Capacitor.isNativePlatform() && (
                    <a
                        href="https://github.com/dayniia/SideQuest/releases/download/latest/app-debug.apk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary icon-only btn-icon"
                        title="Download Android App"
                    >
                        <Smartphone size={18} /> <span className="btn-text">APP</span>
                    </a>
                )}

                <button onClick={onDownload} className="btn-icon">
                    <Download size={18} /> <span className="btn-text">Backup</span>
                </button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onShowYearlyWrapped}
                    className="btn-icon"
                    style={{ background: 'var(--yellow)' }}
                >
                    <Sparkles size={18} /> <span className="btn-text">Yearly Wrapped</span>
                </motion.button>
            </div>
        </header>
    );
};

export default Header;

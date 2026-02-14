import React from 'react';
import { Settings, Music4 } from 'lucide-react';

export default function Header() {
    return (
        <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 border-b border-beatpad-surface/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-beatpad-accent rounded-lg">
                    <Music4 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-beatpad-muted">
                    BeatPad Studio
                </h1>
            </div>

            <button className="p-2 hover:bg-beatpad-surface rounded-full transition-colors text-beatpad-muted hover:text-white">
                <Settings className="w-5 h-5" />
            </button>
        </header>
    );
}

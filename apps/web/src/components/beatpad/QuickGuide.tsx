import React from 'react';

export default function QuickGuide() {
    return (
        <div className="w-full max-w-6xl mx-auto mt-auto border-t border-beatpad-surface/50 pt-6">
            <h3 className="text-sm font-semibold text-beatpad-text mb-3">Quick Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-beatpad-muted">
                <div className="flex items-center gap-2">
                    <span className="text-beatpad-accent font-medium">Click pads</span>
                    <span>or use keyboard keys to play sounds</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-beatpad-accent font-medium">Spacebar</span>
                    <span>to play/pause sequence</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-beatpad-accent font-medium">Click steps</span>
                    <span>in sequencer to program beats</span>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Play, Pause, Square, Repeat, Minus, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Transport() {
    const { isPlaying, setIsPlaying, bpm, setBpm, reset } = useStore();

    const handleBpmChange = (delta: number) => {
        setBpm(Math.max(60, Math.min(240, bpm + delta)));
    };

    return (
        <div className="w-full bg-beatpad-surface rounded-xl p-4 flex items-center justify-between shadow-lg border border-white/5">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-3 rounded-lg transition-all ${isPlaying
                            ? 'bg-beatpad-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                            : 'bg-beatpad-pad hover:bg-beatpad-pad-active/20 text-white'
                        }`}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                    onClick={reset}
                    className="p-3 rounded-lg bg-beatpad-pad hover:bg-beatpad-pad-active/20 text-white transition-colors"
                >
                    <Square className="w-5 h-5 fill-current" />
                </button>

                <button className="p-3 rounded-lg bg-beatpad-pad hover:bg-beatpad-pad-active/20 text-white transition-colors">
                    <Repeat className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-beatpad-muted uppercase tracking-wider">Tempo</span>
                <button onClick={() => handleBpmChange(-1)} className="p-1 hover:text-beatpad-accent transition-colors">
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-light tabular-nums min-w-[3ch] text-center">{bpm}</span>
                <button onClick={() => handleBpmChange(1)} className="p-1 hover:text-beatpad-accent transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-beatpad-muted uppercase tracking-wider">BPM</span>
            </div>
        </div>
    );
}

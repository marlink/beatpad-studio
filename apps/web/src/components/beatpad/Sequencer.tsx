import React from 'react';
import { useStore } from '../../store/useStore';

const TRACKS = [
    { id: 'kick', label: 'Kick' },
    { id: 'snare', label: 'Snare' },
    { id: 'clap', label: 'Clap' },
    { id: 'hihat_c', label: 'Hi-Hat C' },
    { id: 'tom1', label: 'Tom 1' },
    { id: 'tom2', label: 'Tom 2' },
    { id: 'tom3', label: 'Tom 3' },
    { id: 'hihat_o', label: 'Hi-Hat O' },
];

export default function Sequencer() {
    const { sequencerGrid, toggleStep, currentStep, isPlaying } = useStore();

    return (
        <div className="bg-beatpad-surface rounded-xl p-4 shadow-lg border border-white/5 overflow-x-auto">
            <div className="min-w-[500px]">
                <div className="flex mb-2">
                    <div className="w-24 shrink-0"></div>
                    <div className="flex-1 grid grid-cols-16 gap-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-colors ${currentStep === i && isPlaying ? 'bg-beatpad-accent' : 'bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {TRACKS.map((track, rowIdx) => (
                        <div key={track.id} className="flex items-center gap-4">
                            <span className="w-20 shrink-0 text-xs font-medium text-beatpad-muted text-right truncate">
                                {track.label}
                            </span>
                            <div className="flex-1 grid grid-cols-16 gap-1">
                                {sequencerGrid[rowIdx]?.map((isActive, colIdx) => (
                                    <button
                                        key={`${rowIdx}-${colIdx}`}
                                        onClick={() => toggleStep(rowIdx, colIdx)}
                                        className={`
                                        aspect-square rounded-sm transition-all duration-100
                                        ${isActive
                                                ? 'bg-beatpad-step-active shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                                                : 'bg-beatpad-step hover:bg-beatpad-step/80'
                                            }
                                        ${currentStep === colIdx && isPlaying ? 'ring-1 ring-white brightness-125' : ''}
                                    `}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

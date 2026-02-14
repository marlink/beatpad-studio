import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { PresetManager } from '../../audio/PresetManager';
import type { UserSound } from '../../audio/types';
import { SampleEngine } from '../../audio/SampleEngine';
import { cn } from '../../utils/utils';

export default function DrumPads() {
    const { triggerPad, activePads } = useStore();
    const pads = [
        { id: 'kick', label: 'Kick', key: '1' },
        { id: 'snare', label: 'Snare', key: '2' },
        { id: 'clap', label: 'Clap', key: '3' },
        { id: 'hihat_c', label: 'HH Close', key: '4' },
        { id: 'tom1', label: 'Tom 1', key: 'Q' },
        { id: 'tom2', label: 'Tom 2', key: 'W' },
        { id: 'tom3', label: 'Tom 3', key: 'E' },
        { id: 'hihat_o', label: 'HH Open', key: 'R' },
        // Only 8 sounds mapped in audio engine currently, extending grid for visual symmetry or future sounds like FX
        { id: 'fx1', label: 'FX 1', key: 'A' },
        { id: 'fx2', label: 'FX 2', key: 'S' },
        { id: 'perc1', label: 'Perc 1', key: 'D' },
        { id: 'perc2', label: 'Perc 2', key: 'F' },
        { id: 'bass1', label: 'Bass 1', key: 'Z' },
        { id: 'bass2', label: 'Bass 2', key: 'X' },
        { id: 'vox1', label: 'Vox 1', key: 'C' },
        { id: 'vox2', label: 'Vox 2', key: 'V' },
    ];

    const handleDrop = async (e: React.DragEvent, padId: string) => {
        e.preventDefault();
        try {
            const data = e.dataTransfer.getData('application/json');
            if (!data) return;
            const userSound = JSON.parse(data) as UserSound;

            // Re-hydrate buffer isn't possible from JSON, we need to retrieve it or pass ID.
            // Actually, SampleEngine has the buffer if we loaded it.
            // Better approach: pass ID/Metadata and let manager handle it.
            // Since we can't pass Buffer generic over drag n drop easily,
            // we rely on the SampleEngine having it cached or re-loading it.
            // But wait, userSound from SampleLoader has the buffer attached in memory? No, not valid in JSON.

            // Workaround: We passed the object. If it was local, we need the buffer.
            // Let's assume SampleLoader logic cached it in SampleEngine under userSound.id
            // We need to tell PresetManager to perform the assignment.

            PresetManager.getInstance().assignSampleToPad(padId, {
                id: userSound.id,
                name: userSound.name,
                type: 'sample',
                category: 'perc', // Fixed type
                url: '', // It's in memory
                buffer: SampleEngine.getInstance().getPlayer(userSound.id)?.buffer.get() // Grab from engine if possible or re-use reference?
            });

        } catch (err) {
            console.error("Drop failed", err);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const pad = pads.find(p => p.key.toLowerCase() === e.key.toLowerCase());
            if (pad) {
                triggerPad(pad.id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [triggerPad]);

    return (
        <div className="grid grid-cols-4 gap-3 md:gap-4 aspect-square">
            {pads.map((pad) => (
                <button
                    key={pad.id}
                    onMouseDown={() => triggerPad(pad.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, pad.id)}
                    className={cn(
                        "relative rounded-xl p-2 transition-all duration-75 flex flex-col items-center justify-center border-2",
                        activePads.includes(pad.id)
                            ? "bg-beatpad-accent text-white border-beatpad-accent shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-95"
                            : "bg-beatpad-surface text-beatpad-text border-white/5 hover:border-beatpad-accent/50 hover:bg-white/5"
                    )}
                >
                    <span className="text-xs font-bold uppercase tracking-wider">{pad.label}</span>
                    <span className="text-[10px] opacity-40 mt-1 font-mono border border-white/20 px-1 rounded">{pad.key}</span>
                    {/* Visual ripple or glow effect could go here */}
                    {activePads.includes(pad.id) && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                </button>
            ))}
        </div>
    );
}

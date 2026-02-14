import React, { useCallback, useState } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { SampleEngine } from '../../audio/SampleEngine';
import { UserSound } from '../../audio/types';

export default function SampleLoader() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedSounds, setUploadedSounds] = useState<UserSound[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')
        );

        if (files.length === 0) {
            setError('Please drop valid audio files (WAV, MP3)');
            return;
        }

        try {
            const engine = SampleEngine.getInstance();
            const newSounds = await Promise.all(files.map(file => engine.loadUserSound(file)));
            setUploadedSounds(prev => [...prev, ...newSounds]);
        } catch (err) {
            console.error(err);
            setError('Failed to load sounds');
        }
    }, []);

    return (
        <div className="w-full bg-beatpad-surface rounded-xl p-4 border border-white/5">
            <h3 className="text-sm font-semibold text-beatpad-text mb-3 flex items-center gap-2">
                <Music className="w-4 h-4 text-beatpad-accent" />
                Sample Library
            </h3>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center
          ${isDragging
                        ? 'border-beatpad-accent bg-beatpad-accent/10 text-white'
                        : 'border-beatpad-muted/30 text-beatpad-muted hover:border-beatpad-muted/50'
                    }
        `}
            >
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Drag & Drop audio files here</p>
                <p className="text-[10px] opacity-70 mt-1">WAV, MP3 supported</p>
            </div>

            {error && (
                <div className="mt-2 text-red-400 text-xs px-2 py-1 bg-red-400/10 rounded">
                    {error}
                </div>
            )}

            {uploadedSounds.length > 0 && (
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {uploadedSounds.map((sound) => (
                        <div
                            key={sound.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify(sound));
                                e.dataTransfer.effectAllowed = 'copy';
                            }}
                            className="flex items-center justify-between text-xs bg-black/20 p-2 rounded group cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
                        >
                            <span className="truncate flex-1" title={sound.name}>{sound.name}</span>
                            <span className="text-beatpad-muted ml-2">{Math.round(sound.duration * 100) / 100}s</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

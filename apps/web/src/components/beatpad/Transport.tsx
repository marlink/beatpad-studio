import { Play, Pause, Square, Repeat, Minus, Plus, Save, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { usePersistence } from '../../hooks/usePersistence';
import AuthModal from './AuthModal';
import { useState, useEffect } from 'react';

export default function Transport() {
    const { isPlaying, setIsPlaying, bpm, setBpm, reset } = useStore();
    const { saveProject, isLoading } = usePersistence();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const u = localStorage.getItem('beatpad_user');
        if (u) setUser(JSON.parse(u));
    }, []);

    const handleBpmChange = (delta: number) => {
        setBpm(Math.max(60, Math.min(240, bpm + delta)));
    };

    const handleSave = async () => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        await saveProject('My New Beat');
        alert('Project saved successfully!');
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

                <div className="w-[1px] h-8 bg-white/10 mx-2" />

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="p-3 rounded-lg bg-beatpad-pad hover:bg-beatpad-pad-active/20 text-white transition-colors flex items-center gap-2"
                >
                    <Save className={`w-5 h-5 ${isLoading ? 'animate-pulse text-beatpad-accent' : ''}`} />
                    <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Save</span>
                </button>
            </div>

            <div className="flex items-center gap-4">
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

                <button
                    onClick={() => user ? (localStorage.clear(), window.location.reload()) : setIsAuthOpen(true)}
                    className="p-3 rounded-lg bg-beatpad-pad hover:bg-beatpad-pad-active/20 text-white transition-colors group relative"
                >
                    <User className={`w-5 h-5 ${user ? 'text-beatpad-accent' : ''}`} />
                    {user && <span className="absolute -top-1 -right-1 w-2 h-2 bg-beatpad-accent rounded-full" />}
                </button>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
}


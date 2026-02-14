import React, { useState } from 'react';
import { X, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        try {
            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Auth failed');

            localStorage.setItem('beatpad_token', data.token);
            localStorage.setItem('beatpad_user', JSON.stringify(data.user));
            onClose();
            window.location.reload(); // Refresh to update state
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-beatpad-surface border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-beatpad-muted hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    {isRegister ? <><UserPlus className="text-beatpad-accent" /> Join the Studio</> : <><LogIn className="text-beatpad-accent" /> Welcome Back</>}
                </h2>
                <p className="text-sm text-beatpad-muted mb-8">
                    {isRegister ? 'Start saving your beats to the cloud today.' : 'Sign in to access your saved session.'}
                </p>

                {error && <div className="mb-4 p-3 bg-red-400/10 text-red-400 text-xs rounded border border-red-400/20">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-beatpad-muted font-bold ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-beatpad-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-beatpad-accent focus:ring-1 focus:ring-beatpad-accent transition-all outline-none"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-beatpad-muted font-bold ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-beatpad-muted" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-beatpad-accent focus:ring-1 focus:ring-beatpad-accent transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button className="w-full bg-beatpad-accent hover:bg-beatpad-accent/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-beatpad-accent/20">
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <button onClick={() => setIsRegister(!isRegister)} className="text-xs text-beatpad-muted hover:text-beatpad-accent transition-colors">
                        {isRegister ? 'Already have an account? Sign in' : "Don't have an account yet? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}

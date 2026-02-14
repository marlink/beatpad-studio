import React, { useEffect } from 'react';
import Header from './Header';
import Transport from './Transport';
import DrumPads from './DrumPads';
import Sequencer from './Sequencer';
import QuickGuide from './QuickGuide';
import SampleLoader from './SampleLoader';
import { PresetManager } from '../../audio/PresetManager';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/utils'; // Assuming utils exists, or I will create it locally or use classnames directly

export default function BeatPad() {
    const { isPlaying, activePads } = useStore();

    return (
        <div className="min-h-screen bg-beatpad-bg text-beatpad-text font-sans p-4 md:p-8 flex flex-col gap-6">
            <Header />
            <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-6">
                        <Transport />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <section aria-label="Drum Pads">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-beatpad-text/90">Drum Pads</h2>
                                    {/* Preset Selector Placeholder */}
                                    <select
                                        className="bg-beatpad-surface border border-white/10 rounded px-2 py-1 text-xs"
                                        onChange={(e) => PresetManager.getInstance().loadPreset(e.target.value)}
                                    >
                                        <option value="electronic-kit-1">Tech Noir Kit</option>
                                        <option disabled>More coming soon...</option>
                                    </select>
                                </div>
                                <DrumPads />
                            </section>

                            <section aria-label="Step Sequencer">
                                <h2 className="text-lg font-semibold mb-4 text-beatpad-text/90">Step Sequencer</h2>
                                <Sequencer />
                            </section>
                        </div>
                    </div>

                    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
                        <SampleLoader />

                        <div className="bg-beatpad-surface rounded-xl p-4 border border-white/5">
                            <h3 className="text-sm font-semibold mb-3">Master Effects</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-beatpad-muted flex justify-between">
                                        <span>Reverb</span>
                                        <span>30%</span>
                                    </label>
                                    <input type="range" className="w-full text-beatpad-accent" min="0" max="100" defaultValue="30" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-beatpad-muted flex justify-between">
                                        <span>Compression</span>
                                        <span>60%</span>
                                    </label>
                                    <input type="range" className="w-full text-beatpad-accent" min="0" max="100" defaultValue="60" />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <QuickGuide />
        </div>
    );
}

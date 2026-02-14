import { useEffect } from 'react';
import * as Tone from 'tone';
import { useStore } from '../store/useStore';
import { PresetManager, DEFAULT_PRESETS } from './PresetManager';

export function useSoundEngine() {
    const { isPlaying, bpm, setCurrentStep } = useStore();

    useEffect(() => {
        const presetManager = PresetManager.getInstance();

        // Load default preset
        presetManager.loadPreset(DEFAULT_PRESETS[0].id).catch(console.error);

        const loop = new Tone.Loop((time) => {
            const step = useStore.getState().currentStep;
            const nextStep = (step + 1) % 16;

            Tone.Draw.schedule(() => {
                setCurrentStep(nextStep);
            }, time);

            // Trigger sequencer steps
            const grid = useStore.getState().sequencerGrid;
            // Map row index to sound key (matching PresetManager keys)
            const rowToKey = ['kick', 'snare', 'clap', 'hihat_c', 'tom1', 'tom2', 'tom3', 'hihat_o'];

            grid.forEach((row, rowIdx) => {
                if (row[nextStep]) {
                    const key = rowToKey[rowIdx];
                    presetManager.playSound(key, time);
                }
            });

        }, '16n').start(0);

        return () => {
            loop.dispose();
            // We might not want to dispose the singleton PresetManager here if it persists across re-renders
            // but we should stop playback.
        };
    }, []); // Run once on mount

    // Sync BPM
    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    // Sync Play/Pause
    useEffect(() => {
        if (isPlaying) {
            if (Tone.context.state !== 'running') {
                Tone.context.resume();
            }
            Tone.Transport.start();
        } else {
            Tone.Transport.stop();
        }
    }, [isPlaying]);

    // Handle manual triggers (pads) - Subscribe to store
    useEffect(() => {
        const unsub = useStore.subscribe((state, prevState) => {
            const newActive = state.activePads.filter(x => !prevState.activePads.includes(x));
            newActive.forEach(id => {
                PresetManager.getInstance().playSound(id);
            });
        });
        return unsub;
    }, []);
}

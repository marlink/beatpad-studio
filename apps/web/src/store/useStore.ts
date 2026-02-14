import { create } from 'zustand';

interface BeatPadState {
    isPlaying: boolean;
    bpm: number;
    currentStep: number;
    sequencerGrid: boolean[][]; // 4 rows (Kick, Snare, Clap, HiHat) x 16 steps
    activePads: string[]; // IDs of pads currently lit up

    setIsPlaying: (isPlaying: boolean) => void;
    setBpm: (bpm: number) => void;
    setCurrentStep: (step: number) => void;
    toggleStep: (row: number, col: number) => void;
    triggerPad: (id: string) => void;
    reset: () => void;
}

const INITIAL_GRID = Array(8).fill(null).map(() => Array(16).fill(false));

export const useStore = create<BeatPadState>((set) => ({
    isPlaying: false,
    bpm: 120,
    currentStep: 0,
    sequencerGrid: INITIAL_GRID,
    activePads: [],

    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setBpm: (bpm) => set({ bpm }),
    setCurrentStep: (currentStep) => set({ currentStep }),

    toggleStep: (row, col) => set((state) => {
        const newGrid = state.sequencerGrid.map((r, rIdx) =>
            rIdx === row ? r.map((c, cIdx) => cIdx === col ? !c : c) : r
        );
        return { sequencerGrid: newGrid };
    }),

    triggerPad: (id) => {
        set((state) => ({ activePads: [...state.activePads, id] }));
        setTimeout(() => {
            set((state) => ({ activePads: state.activePads.filter((p) => p !== id) }));
        }, 150);
    },

    reset: () => set({
        isPlaying: false,
        currentStep: 0,
        activePads: []
    }),
}));

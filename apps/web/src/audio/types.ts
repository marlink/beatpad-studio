export interface SoundSample {
    id: string;
    name: string;
    url: string;
    type: 'synth' | 'sample';
    category: SoundCategory;
    // Sample specific
    buffer?: AudioBuffer;
    duration?: number;
    offset?: number;
    // Synth specific
    synthType?: 'membrane' | 'noise' | 'metal' | 'pluck' | 'mono';
    synthConfig?: any;
}

export type SoundCategory = 'kick' | 'snare' | 'clap' | 'hihat_c' | 'hihat_o' | 'tom' | 'perc' | 'fx' | 'bass' | 'melodic';

export interface SoundPreset {
    id: string;
    name: string;
    category: 'acoustic' | 'electronic' | 'hiphop' | 'trap' | 'lofi';
    sounds: Record<string, SoundSample>; // Map padId (kick, snare...) to SoundSample
    tags: string[];
    author?: string;
    bpm?: number;
}

export interface UserSound {
    id: string;
    name: string;
    file: File;
    buffer: AudioBuffer;
    duration: number;
    format: string;
    createdAt: Date;
}

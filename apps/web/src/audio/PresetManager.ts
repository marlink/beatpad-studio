import { SoundPreset, SoundSample } from './types';
import { SampleEngine } from './SampleEngine';
import * as Tone from 'tone';

// Define some default presets with placeholders / synth configs
export const DEFAULT_PRESETS: SoundPreset[] = [
    {
        id: 'electronic-kit-1',
        name: 'Tech Noir Kit',
        category: 'electronic',
        tags: ['synth', 'dark'],
        sounds: {
            kick: { id: 'kick', name: 'Kick', type: 'synth', category: 'kick', url: '', synthType: 'membrane' },
            snare: { id: 'snare', name: 'Snare', type: 'synth', category: 'snare', url: '', synthType: 'noise' },
            clap: { id: 'clap', name: 'Clap', type: 'synth', category: 'clap', url: '', synthType: 'noise' },
            hihat_c: { id: 'hihat_c', name: 'HiHat Closed', type: 'synth', category: 'hihat_c', url: '', synthType: 'metal' },
            hihat_o: { id: 'hihat_o', name: 'HiHat Open', type: 'synth', category: 'hihat_o', url: '', synthType: 'metal' },
            tom1: { id: 'tom1', name: 'Tom Low', type: 'synth', category: 'tom', url: '', synthType: 'membrane' },
            tom2: { id: 'tom2', name: 'Tom Mid', type: 'synth', category: 'tom', url: '', synthType: 'membrane' },
            tom3: { id: 'tom3', name: 'Tom High', type: 'synth', category: 'tom', url: '', synthType: 'membrane' },
        }
    },
    // Future: Add Sample-based presets here once we have URLs/Assets
];

export class PresetManager {
    private static instance: PresetManager;
    private currentPreset: SoundPreset = DEFAULT_PRESETS[0];

    // Keep track of active synths (since we mix synths and samples)
    private activeSynths: Map<string, Tone.Synth | Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth> = new Map();

    // Effects
    private reverb: Tone.Reverb;
    private limiter: Tone.Limiter;

    // Quick Switch Slots
    private quickSlots: Map<number, SoundPreset> = new Map();

    private constructor() {
        this.limiter = new Tone.Limiter(-1).toDestination();
        this.reverb = new Tone.Reverb({ decay: 2, wet: 0.2 }).connect(this.limiter);
    }

    public static getInstance(): PresetManager {
        if (!PresetManager.instance) {
            PresetManager.instance = new PresetManager();
        }
        return PresetManager.instance;
    }

    public saveToQuickSlot(slot: number) {
        this.quickSlots.set(slot, { ...this.currentPreset });
        console.log(`Saved to slot ${slot}`);
    }

    public loadFromQuickSlot(slot: number) {
        const preset = this.quickSlots.get(slot);
        if (preset) {
            this.currentPreset = preset;
            this.refreshSounds();
            console.log(`Loaded from slot ${slot}`);
        }
    }

    public assignSampleToPad(padId: string, sample: SoundSample) {
        this.currentPreset.sounds[padId] = sample;
        // If live, we might want to reload just this sound
        if (sample.type === 'sample' && sample.url) {
            SampleEngine.getInstance().loadSample(padId, sample.url); // Use padId as key
        }
        this.refreshSounds();
    }

    private async refreshSounds() {
        // Re-run load logic
        // Dispose old synths
        this.activeSynths.forEach(s => s.dispose());
        this.activeSynths.clear();

        // Initialize new sounds
        for (const [key, sound] of Object.entries(this.currentPreset.sounds)) {
            if (sound.type === 'sample' && sound.url) {
                if (sound.buffer) {
                    await SampleEngine.getInstance().loadSample(key, sound.buffer);
                } else {
                    await SampleEngine.getInstance().loadSample(key, sound.url);
                }
            } else if (sound.type === 'synth') {
                // ... (init synth logic duplicated from loadPreset - ideally refactor)
                let synth;
                switch (sound.synthType) {
                    case 'membrane':
                        synth = new Tone.MembraneSynth().connect(this.reverb);
                        break;
                    case 'noise':
                        synth = new Tone.NoiseSynth().connect(this.reverb);
                        break;
                    case 'metal':
                        synth = new Tone.MetalSynth().connect(this.reverb);
                        break;
                    default:
                        synth = new Tone.Synth().connect(this.reverb);
                }
                this.activeSynths.set(key, synth);
            }
        }
        SampleEngine.getInstance().connect(this.reverb);
    }

    public setEffect(name: 'reverb' | 'compression', value: number) {
        if (name === 'reverb') {
            this.reverb.wet.value = value / 100;
        }
        // Limiter threshold is fixed for now, but we could add a compressor
    }

    public async loadPreset(presetId: string): Promise<void> {
        const preset = DEFAULT_PRESETS.find(p => p.id === presetId);
        if (!preset) throw new Error(`Preset ${presetId} not found`);

        this.currentPreset = preset;

        // Dispose old synths
        this.activeSynths.forEach(s => s.dispose());
        this.activeSynths.clear();

        // Initialize new sounds
        for (const [key, sound] of Object.entries(preset.sounds)) {
            if (sound.type === 'sample' && sound.url) {
                // Load into SampleEngine
                await SampleEngine.getInstance().loadSample(key, sound.url);
            } else if (sound.type === 'synth') {
                // Init Synth
                let synth;
                switch (sound.synthType) {
                    case 'membrane':
                        synth = new Tone.MembraneSynth().connect(this.reverb);
                        break;
                    case 'noise':
                        synth = new Tone.NoiseSynth().connect(this.reverb);
                        break;
                    case 'metal':
                        synth = new Tone.MetalSynth().connect(this.reverb);
                        break;
                    default:
                        synth = new Tone.Synth().connect(this.reverb);
                }
                this.activeSynths.set(key, synth);
            }
        }

        // Route SampleEngine through effects
        SampleEngine.getInstance().connect(this.reverb);
    }

    public playSound(key: string, time?: number) {
        const sound = this.currentPreset.sounds[key];
        if (!sound) return; // Or fallback

        if (sound.type === 'sample') {
            SampleEngine.getInstance().play(key, time);
        } else {
            const synth = this.activeSynths.get(key);
            if (synth) {
                // Cast time to any to satisfy Tone.Time overload issues in strict mode
                const t = time as any;

                // Basic trigger logic - can be refined per instrument
                if (key === 'kick') synth.triggerAttackRelease('C2', '8n', t);
                else if (key.includes('tom')) synth.triggerAttackRelease('G2', '8n', t);
                else if (key.includes('hihat')) (synth as Tone.MetalSynth).triggerAttackRelease('32n', t, 0.6);
                else synth.triggerAttackRelease('8n', t);
            }
        }
    }
}

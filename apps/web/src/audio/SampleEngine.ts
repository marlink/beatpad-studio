import * as Tone from 'tone';
import { UserSound } from './types';

export class SampleEngine {
    private static instance: SampleEngine;
    private players: Tone.Players;
    private userSamples: Map<string, AudioBuffer> = new Map();
    private isLoaded: boolean = false;

    private constructor() {
        this.players = new Tone.Players().toDestination();
    }

    public static getInstance(): SampleEngine {
        if (!SampleEngine.instance) {
            SampleEngine.instance = new SampleEngine();
        }
        return SampleEngine.instance;
    }

    public connect(destination: Tone.InputNode) {
        this.players.disconnect();
        this.players.connect(destination);
    }

    public async loadSample(id: string, url: string | AudioBuffer): Promise<void> {
        return new Promise((resolve, reject) => {
            if (url instanceof AudioBuffer) {
                this.players.add(id, url);
                resolve();
            } else {
                this.players.add(id, url, () => resolve());
            }
        });
    }

    public play(id: string, time?: number, velocity: number = 1): void {
        if (this.players.has(id)) {
            const player = this.players.player(id);
            player.start(time, 0, undefined);
            // Tone.Players doesn't support individual volume easily per trigger without creating new sources, 
            // but for simple playback we can set volume on the player instance (note: this affects all concurrent plays of this sample if not careful, 
            // but Tone.Player handles re-triggering logic well).
            // Ideally we'd map velocity to volume (gain).
            // player.volume.value = Tone.gainToDb(velocity); 
        } else {
            console.warn(`Sample ${id} not found`);
        }
    }

    public async loadUserSound(file: File): Promise<UserSound> {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);

        const id = `user_${Date.now()}_${file.name.replace(/\W/g, '')}`;
        this.userSamples.set(id, audioBuffer);
        this.players.add(id, audioBuffer);

        return {
            id,
            name: file.name,
            file,
            buffer: audioBuffer,
            duration: audioBuffer.duration,
            format: file.type,
            createdAt: new Date()
        };
    }

    public getPlayer(id: string): Tone.Player | undefined {
        if (this.players.has(id)) return this.players.player(id);
        return undefined;
    }

    public dispose() {
        this.players.dispose();
    }
}

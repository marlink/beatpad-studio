import BeatPad from '../components/beatpad/BeatPad';
import { useSoundEngine } from '../audio/SoundEngine';

export default function Page() {
  // Initialize audio engine
  useSoundEngine();

  return <BeatPad />;
}

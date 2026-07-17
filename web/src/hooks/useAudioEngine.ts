import { useRef, useSyncExternalStore } from "react";
import { AudioEngine } from "../audio";

/**
 * Lazily construct a single {@link AudioEngine} for the app's lifetime.
 *
 * The engine wraps Tone's *global* transport + AudioContext and registers
 * transport listeners in its constructor, so it must exist exactly once. The
 * ref guard guarantees that even if React re-renders the owning component. (We
 * deliberately don't wrap the app in <StrictMode>, whose simulated double-mount
 * would otherwise create two engines competing over the one global transport.)
 *
 * Returns the engine instance and its current `synthError` (null when healthy),
 * kept up-to-date via the engine's callback.
 */
export function useAudioEngine(): { audio: AudioEngine; synthError: string | null } {
  const ref = useRef<AudioEngine | null>(null);
  if (ref.current === null) ref.current = new AudioEngine();
  const audio = ref.current;

  const synthError = useSyncExternalStore(
    (onStoreChange) => {
      audio.setSynthStateCallback(onStoreChange);
      return () => audio.setSynthStateCallback(null);
    },
    () => audio.synthError,
  );

  return { audio, synthError };
}

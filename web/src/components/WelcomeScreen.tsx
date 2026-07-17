import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { ConditioningPanel } from "./ConditioningPanel";
import { useI18n } from "../i18n/context";
import type { AppError } from "../App";

/**
 * First screen of the two-step flow: pick an audio file, then optionally choose
 * conditioning instruments, then hit "Transcribe" to hand off to the main view.
 * Transcription doesn't start until the button is clicked.
 */
export function WelcomeScreen(props: {
  selectedFile: File | null;
  onPickFile: (file: File) => void;
  /** Loads the bundled demo track + its suggested conditioning. */
  onUseExample: () => Promise<void>;
  condSelected: Set<string>;
  onCondChange: (next: Set<string>) => void;
  onTranscribe: () => void;
  /** True while a file is dragged over the window; swaps the prompt in place. */
  dragging: boolean;
  /** A server-down notice replaces the picker; a file error sits beside it. */
  error: AppError | null;
  setError: Dispatch<SetStateAction<AppError | null>>;
  loadingSoundFont: boolean;
  onLoadSoundFont: (file: File) => void;
}) {
  const {
    selectedFile,
    onPickFile,
    onUseExample,
    condSelected,
    onCondChange,
    onTranscribe,
    dragging,
    error,
    setError,
    loadingSoundFont,
    onLoadSoundFont,
  } = props;
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sfInputRef = useRef<HTMLInputElement>(null);
  const [loadingExample, setLoadingExample] = useState(false);

  // Probe the server on mount. A failure swaps the file picker for a
  // server-down notice; success clears a stale server-down notice so the user
  // can try again once the server recovers. A file error (e.g. an undecodable
  // upload) is left alone — the server being up doesn't make a bad file good.
  useEffect(() => {
    let cancelled = false;
    const clearServerError = () =>
      setError((prev) => (prev?.kind === "server" ? null : prev));
    fetch("/health")
      .then((r) => {
        if (cancelled) return;
        if (r.ok) clearServerError();
        else setError({ kind: "server", message: t("welcome.serverDown") });
      })
      .catch(() => {
        if (!cancelled) setError({ kind: "server", message: t("welcome.serverDown") });
      });
    return () => {
      cancelled = true;
    };
  }, [setError]);

  async function handleExample() {
    setLoadingExample(true);
    try {
      await onUseExample();
    } catch (e) {
      alert(t("app.loadExampleError") + (e as Error).message);
    } finally {
      setLoadingExample(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-7 pb-12 pt-2 animate-rise [animation-delay:0.06s]">
      <p className="text-base leading-relaxed text-muted">
        {t("welcome.intro")}
      </p>
      {/* Explicit extensions alongside the wildcard, needed for iOS Safari
       * which sometimes grays out perfectly valid audio files otherwise. */}
      <input
        type="file"
        accept="audio/*,.mp3,.m4a,.aac,.wav,.aiff,.aif,.flac,.ogg,.oga,.opus"
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickFile(f);
          // Allow re-picking the same file (onChange won't fire otherwise).
          e.target.value = "";
        }}
      />

      {/* Hidden input for local SoundFont (.sf3 / .sf2) — shown when the
       * backend fails to serve the soundfont. */}
      <input
        type="file"
        accept=".sf3,.sf2"
        hidden
        ref={sfInputRef}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onLoadSoundFont(f);
          e.target.value = "";
        }}
      />

      <section className={clsx("card p-0", dragging && "animate-drag-glow")}>
        {error?.kind === "server" ? (
          <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
            <p className="m-0 font-serif text-5xl leading-none text-content">
              {t("welcome.unavailable")}
            </p>
            <p className="m-0 max-w-md text-base text-muted">{error.message}</p>
          </div>
        ) : selectedFile === null ? (
          <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
            <div
              className="h-16 w-32 bg-accent"
              style={{
                maskImage: "url(/muscriptor-wave.svg)",
                WebkitMaskImage: "url(/muscriptor-wave.svg)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
              aria-hidden="true"
            />
            <p className="m-0 text-base text-muted">
              {dragging ? (
                <span className="font-semibold text-content">{t("welcome.dropAnywhere")}</span>
              ) : (
                <>
                  {t("welcome.dropHint")}{" "}
                  <strong className="font-semibold text-content">audio file</strong>,
                  or
                </>
              )}
            </p>
            <Button
              size="text-base"
              pad="px-7 py-3"
              className="rounded-xl border-transparent bg-content font-semibold text-[#15151b] hover:border-transparent hover:bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              {t("welcome.selectFile")}
            </Button>
            <Button
              kind="ghost"
              className="px-1 py-0.5 text-sm text-muted underline underline-offset-4 hover:bg-transparent enabled:hover:text-content"
              onClick={handleExample}
              disabled={loadingExample}
            >
              {loadingExample ? t("app.loadingExample") : t("app.tryExample")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2.5 px-8 py-7">
            <p
              className="m-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-2xl leading-[1.1] text-content"
              title={selectedFile.name}
            >
              {selectedFile.name}
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              {t("welcome.chooseDifferent")}
            </Button>
          </div>
        )}
      </section>

      {error?.kind === "file" && (
        <p className="m-0 rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-red">
          {error.message}
        </p>
      )}

      {error?.kind === "soundfont" && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber/40 bg-amber/10 px-4 py-4 text-sm">
          <p className="m-0 text-amber">
            <strong>{t("welcome.soundfontError")}</strong>{" "}
            {error.message}
          </p>
          <p className="m-0 text-muted">
            {t("welcome.soundfontHint")}
          </p>
          <Button
            onClick={() => sfInputRef.current?.click()}
            disabled={loadingSoundFont}
            className="self-start"
          >
            {loadingSoundFont ? t("welcome.loading") : t("welcome.loadSoundFont")}
          </Button>
        </div>
      )}

      {error?.kind !== "server" && selectedFile !== null && (
        <>
          <ConditioningPanel selected={condSelected} onChange={onCondChange} />
          <div className="flex justify-end">
            <Button kind="primary" size="text-base" pad="px-9 py-3" onClick={onTranscribe}>
              {t("welcome.transcribe")}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

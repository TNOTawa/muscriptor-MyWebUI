const en = {
  app: {
    title: "MuScriptor",
    tagline: "Audio to MIDI transcription",
    logoAlt: "MuScriptor logo",
    transcribeAnother: "Transcribe another file",
    discardConfirm: "Discard this transcription and start over?",
    discardDropped: "Discard this transcription and start over with the dropped file?",
    loadingExample: "Loading example…",
    tryExample: "or try an example track",
    loadExampleError: "Couldn't load the example file: ",
  },
  welcome: {
    intro:
      "MuScriptor is the best open model for multi-instrument transcription to date. Give it a recording: pop, classical, metal, jazz, whatever, and it transcribes the notes played by every instrument into MIDI, for you to download or explore interactively.",
    serverDown: "The muscriptor server is temporarily unavailable.",
    unavailable: "unavailable",
    dropAnywhere: "Drop anywhere",
    dropHint: "Drop an audio file here, or",
    selectFile: "Select an audio file",
    chooseDifferent: "Choose a different file",
    transcribe: "Transcribe",
    soundfontError: "SoundFont failed to load:",
    soundfontHint:
      "The browser synthesizer needs a SoundFont to play MIDI notes. You can download MuseScore_General.sf3 from musescore.org and load it here, or drop any .sf2/.sf3 file onto this page.",
    loadSoundFont: "Load local SoundFont",
    loading: "Loading…",
  },
  conditioning: {
    title: "What instruments are there in this track?",
    description:
      "Optional. Leave empty to let the model detect anything; listing instruments here forbids every other instrument from appearing.",
    clear: "Clear",
    placeholder: "Add an instrument…",
    removeInstrument: "Remove {name}",
  },
  controls: {
    play: "Play",
    pause: "Pause",
    followPlayhead: "Follow playhead",
    stopFollowing: "Stop following the playhead",
    scrollAlong: "Scroll along with the playhead",
    original: "Original",
    midi: "MIDI",
    stereo: "Stereo",
  },
  instruments: {
    title: "Instruments",
    helpSpecified:
      "The instruments you specified. Greyed-out ones weren't detected in the audio.",
    moreInstruments: "More instruments",
    helpMore:
      "More instruments that the model detected in the audio, even without them being explicitly given.",
    notDetected: "not detected",
    solo: "Solo (mute everything else)",
    unsolo: "Unsolo",
    mute: "Mute on MIDI track",
    unmute: "Unmute on MIDI track",
    helpHint: "What does this mean?",
  },
  output: {
    estimating: "estimating…",
    doneIn: "done in",
    download: "Download",
    synthesizing: "Synthesizing…",
    midiFile: "MIDI file",
    wavTranscriptionOnly: "WAV - transcription only",
    wavTranscriptionOnlyDesc: "Just the transcribed notes, played with a SoundFont (mono)",
    wavStereo: "WAV - stereo with original",
    wavStereoDesc: "Original audio (L) + transcribed notes played with a SoundFont (R)",
    transcribeAnother: "Transcribe another file",
    stopTranscribing: "Stop",
    synthError: "Couldn't create the audio file: ",
  },
  drop: {
    text: "Drop an audio file to transcribe",
    strong: "audio file",
  },
  footer: {
    text:
      "MuScriptor is a multi-instrument automatic music transcription model: it turns raw audio into per-instrument MIDI. Built by",
  },
  consent: {
    text:
      "We use cookies (Google Analytics) to understand how this demo is used: page visits and anonymous usage events, e.g. the length of the transcribed audio and the instruments you select; never the audio itself. See the",
    privacyPolicy: "privacy policy",
    accept: "Accept",
    decline: "Decline",
  },
  server: {
    unavailable: "The muscriptor server is temporarily unavailable. Please try again later.",
  },
};

export default en;
export type LocaleStrings = typeof en;

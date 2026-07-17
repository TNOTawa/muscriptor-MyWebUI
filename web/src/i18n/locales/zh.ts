import type { LocaleStrings } from "./en";

const zh: LocaleStrings = {
  app: {
    title: "MuScriptor",
    tagline: "音频转MIDI转录",
    logoAlt: "MuScriptor 标志",
    transcribeAnother: "重新转录其他文件",
    discardConfirm: "放弃当前转录并重新开始？",
    discardDropped: "放弃当前转录并以拖放的文件重新开始？",
    loadingExample: "加载示例中…",
    tryExample: "或尝试示例曲目",
    loadExampleError: "无法加载示例文件：",
  },
  welcome: {
    intro:
      "MuScriptor 是当前最优秀的开源多乐器自动转录模型。给它一段录音：流行、古典、金属、爵士，无论什么风格，它会将每种乐器演奏的音符转录为 MIDI，供您下载或交互式浏览。",
    serverDown: "MuScriptor 服务器暂时不可用。",
    unavailable: "不可用",
    dropAnywhere: "任意位置释放",
    dropHint: "将音频文件拖放到此处，或",
    selectFile: "选择音频文件",
    chooseDifferent: "选择其他文件",
    transcribe: "开始转录",
    soundfontError: "SoundFont 加载失败：",
    soundfontHint:
      "浏览器合成器需要 SoundFont 才能播放 MIDI 音符。您可以从 musescore.org 下载 MuseScore_General.sf3 后在此加载，也可以将任意 .sf2/.sf3 文件拖放到此页面。",
    loadSoundFont: "加载本地 SoundFont",
    loading: "加载中…",
  },
  conditioning: {
    title: "这首曲目中有哪些乐器？",
    description:
      "可选。留空让模型自动检测所有乐器；在此列出乐器将禁止其他乐器出现。",
    clear: "清空",
    placeholder: "添加乐器…",
    removeInstrument: "移除 {name}",
  },
  controls: {
    play: "播放",
    pause: "暂停",
    followPlayhead: "跟随播放头",
    stopFollowing: "停止跟随播放头",
    scrollAlong: "跟随播放头滚动",
    original: "原声",
    midi: "MIDI",
    stereo: "立体声",
  },
  instruments: {
    title: "乐器",
    helpSpecified: "您指定的乐器。灰色表示在音频中未检测到。",
    moreInstruments: "更多乐器",
    helpMore: "模型在音频中检测到的其他乐器，即使没有明确指定。",
    notDetected: "未检测到",
    solo: "独奏（静音其他所有乐器）",
    unsolo: "取消独奏",
    mute: "在 MIDI 轨道上静音",
    unmute: "取消静音",
    helpHint: "这是什么意思？",
  },
  output: {
    estimating: "估算中…",
    doneIn: "预计剩余",
    download: "下载",
    synthesizing: "合成中…",
    midiFile: "MIDI 文件",
    wavTranscriptionOnly: "WAV - 仅转录",
    wavTranscriptionOnlyDesc: "仅转录的音符，使用 SoundFont 播放（单声道）",
    wavStereo: "WAV - 与原声立体声混音",
    wavStereoDesc: "原始音频（左声道）+ 转录音符 SoundFont 播放（右声道）",
    transcribeAnother: "转录其他文件",
    stopTranscribing: "停止",
    synthError: "无法创建音频文件：",
  },
  drop: {
    text: "拖放音频文件以进行转录",
    strong: "音频文件",
  },
  footer: {
    text: "MuScriptor 是一个多乐器自动音乐转录模型：将原始音频转换为每种乐器的 MIDI。由",
  },
  consent: {
    text: "我们使用 Cookie（Google Analytics）来了解此演示的使用情况：页面访问和匿名使用事件，例如转录音频的长度以及您选择的乐器；绝不包含音频本身。请参阅",
    privacyPolicy: "隐私政策",
    accept: "接受",
    decline: "拒绝",
  },
  server: {
    unavailable: "MuScriptor 服务器暂时不可用，请稍后重试。",
  },
};

export default zh;

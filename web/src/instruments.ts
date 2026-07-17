/**
 * Fuzzy matching for the conditioning instrument picker.
 *
 * The backend instrument ids (e.g. `french_horn`) are terse and don't cover the
 * many ways a musician might search — by family ("brass"), by colloquial name
 * ("rhodes", "fiddle"), or with a typo. `ALIASES` maps each id to extra search
 * terms, and `scoreInstrument` ranks a candidate against a query using those
 * terms plus a subsequence fallback for typos.
 *
 * Chinese search support via zh_aliases from i18n/instruments.ts.
 */

/**
 * Family / category keywords, each expanded to the instrument ids it covers.
 * Kept separate from per-instrument aliases so a family can be edited in one
 * place; both are folded into the per-instrument alias lists below.
 */
const FAMILIES: Record<string, string[]> = {
  keys: ["acoustic_piano", "electric_piano", "organ"],
  keyboard: ["acoustic_piano", "electric_piano", "organ"],
  piano: ["acoustic_piano", "electric_piano"],
  guitar: [
    "acoustic_guitar",
    "clean_electric_guitar",
    "distorted_electric_guitar",
  ],
  bass: ["acoustic_bass", "electric_bass", "contrabass"],
  strings: [
    "violin",
    "viola",
    "cello",
    "contrabass",
    "orchestral_harp",
    "string_ensemble",
    "synth_strings",
  ],
  orchestra: [
    "violin",
    "viola",
    "cello",
    "contrabass",
    "orchestral_harp",
    "timpani",
    "string_ensemble",
    "french_horn",
    "trumpet",
    "trombone",
    "tuba",
    "oboe",
    "english_horn",
    "bassoon",
    "clarinet",
    "flutes",
  ],
  brass: ["trumpet", "trombone", "tuba", "french_horn", "brass_section"],
  horns: ["trumpet", "trombone", "tuba", "french_horn", "brass_section"],
  woodwind: [
    "oboe",
    "english_horn",
    "bassoon",
    "clarinet",
    "flutes",
    "soprano_and_alto_sax",
    "tenor_sax",
    "baritone_sax",
  ],
  woodwinds: [
    "oboe",
    "english_horn",
    "bassoon",
    "clarinet",
    "flutes",
    "soprano_and_alto_sax",
    "tenor_sax",
    "baritone_sax",
  ],
  reed: ["oboe", "english_horn", "bassoon", "clarinet"],
  sax: ["soprano_and_alto_sax", "tenor_sax", "baritone_sax"],
  saxophone: ["soprano_and_alto_sax", "tenor_sax", "baritone_sax"],
  wind: [
    "trumpet",
    "trombone",
    "tuba",
    "french_horn",
    "brass_section",
    "oboe",
    "english_horn",
    "bassoon",
    "clarinet",
    "flutes",
    "soprano_and_alto_sax",
    "tenor_sax",
    "baritone_sax",
  ],
  percussion: ["drums", "timpani", "chromatic_percussion"],
  synth: ["synth_strings", "synth_lead", "synth_pad"],
  vocals: ["voice"],
  vocal: ["voice"],
};

/** Per-instrument colloquial names and common spellings. */
const SPECIFIC: Record<string, string[]> = {
  acoustic_piano: ["grand piano", "grand", "upright piano"],
  electric_piano: ["rhodes", "wurlitzer", "wurli", "ep", "e-piano"],
  chromatic_percussion: [
    "vibraphone",
    "vibes",
    "marimba",
    "xylophone",
    "glockenspiel",
    "bells",
    "celesta",
  ],
  organ: ["hammond", "pipe organ", "b3"],
  acoustic_guitar: ["nylon", "steel string", "acoustic"],
  clean_electric_guitar: ["electric guitar", "clean guitar"],
  distorted_electric_guitar: [
    "electric guitar",
    "distortion",
    "overdrive",
    "distorted guitar",
  ],
  acoustic_bass: ["upright bass", "double bass", "stand-up bass"],
  electric_bass: ["bass guitar", "e-bass", "electric bass"],
  violin: ["fiddle"],
  cello: ["violoncello"],
  contrabass: ["double bass", "upright bass"],
  orchestral_harp: ["harp"],
  timpani: ["kettle drum", "kettledrums"],
  string_ensemble: ["string section", "strings"],
  synth_strings: ["synth strings", "string pad"],
  voice: ["vocals", "vocal", "singer", "choir", "vox"],
  orchestra_hit: ["orch hit", "stab", "hit"],
  french_horn: ["horn"],
  brass_section: ["brass", "horn section", "horns"],
  soprano_and_alto_sax: ["alto sax", "soprano sax", "alto", "soprano"],
  tenor_sax: ["tenor"],
  baritone_sax: ["bari sax", "baritone", "bari"],
  english_horn: ["cor anglais"],
  flutes: ["flute", "piccolo", "recorder"],
  synth_lead: ["lead"],
  synth_pad: ["pad"],
  drums: ["drum kit", "drumkit", "kit", "beat", "percussion"],
};

/** Chinese search aliases (merged into ALIASES below). */
const ZH_ALIASES: Record<string, string[]> = {
  acoustic_piano: ["原声钢琴", "三角钢琴", "立式钢琴", "大钢琴", "钢琴"],
  electric_piano: ["电钢琴", "电子钢琴", "电钢", "沃利策"],
  chromatic_percussion: ["色彩打击乐", "颤音琴", "马林巴", "木琴", "钟琴", "钢片琴", "打击乐"],
  organ: ["风琴", "管风琴", "电子管风琴", "哈蒙德", "键盘"],
  acoustic_guitar: ["原声吉他", "尼龙弦吉他", "钢弦吉他", "木吉他", "吉他"],
  clean_electric_guitar: ["清音电吉他", "干净电吉他", "吉他"],
  distorted_electric_guitar: ["失真电吉他", "失真吉他", "过载吉他", "重金属吉他", "吉他"],
  acoustic_bass: ["原声贝斯", "低音提琴", "大贝斯", "木贝斯", "贝斯"],
  electric_bass: ["电贝斯", "贝斯吉他", "贝斯"],
  violin: ["小提琴", "提琴", "弦乐"],
  viola: ["中提琴", "弦乐"],
  cello: ["大提琴", "弦乐"],
  contrabass: ["低音提琴", "倍大提琴", "大贝斯", "贝斯", "弦乐"],
  orchestral_harp: ["竖琴", "管弦竖琴", "弦乐"],
  timpani: ["定音鼓", "铜鼓", "打击乐"],
  string_ensemble: ["弦乐合奏", "弦乐组", "弦乐群", "弦乐"],
  synth_strings: ["合成弦乐", "弦乐铺底", "合成器", "弦乐"],
  voice: ["人声", "歌声", "歌手", "合唱", "人声合唱", "哼唱"],
  orchestra_hit: ["交响乐团重音", "乐团重击", "管弦重音"],
  trumpet: ["小号", "喇叭", "铜管"],
  trombone: ["长号", "拉管", "铜管"],
  tuba: ["大号", "铜管"],
  french_horn: ["圆号", "法国号", "铜管"],
  brass_section: ["铜管合奏", "铜管组", "铜管乐", "铜管"],
  soprano_and_alto_sax: ["高音萨克斯", "中音萨克斯", "萨克斯"],
  tenor_sax: ["次中音萨克斯", "萨克斯"],
  baritone_sax: ["上低音萨克斯", "低音萨克斯", "萨克斯"],
  oboe: ["双簧管", "欧伯", "木管"],
  english_horn: ["英国管", "木管"],
  bassoon: ["巴松管", "大管", "低音管", "木管"],
  clarinet: ["单簧管", "黑管", "竖笛", "木管"],
  flutes: ["长笛", "笛子", "短笛", "木管"],
  synth_lead: ["合成主音", "主音合成器", "旋律合成", "合成器"],
  synth_pad: ["合成铺底", "铺底音色", "氛围合成", "合成器"],
  drums: ["鼓组", "架子鼓", "鼓", "打击乐"],
};

/** Chinese family → ids. */
const ZH_FAMILIES: Record<string, string[]> = {
  "键盘": ["acoustic_piano", "electric_piano", "organ"],
  "钢琴": ["acoustic_piano", "electric_piano"],
  "吉他": ["acoustic_guitar", "clean_electric_guitar", "distorted_electric_guitar"],
  "贝斯": ["acoustic_bass", "electric_bass", "contrabass"],
  "弦乐": ["violin", "viola", "cello", "contrabass", "orchestral_harp", "string_ensemble", "synth_strings"],
  "管弦乐": ["violin", "viola", "cello", "contrabass", "orchestral_harp", "timpani", "string_ensemble", "french_horn", "trumpet", "trombone", "tuba", "oboe", "english_horn", "bassoon", "clarinet", "flutes"],
  "铜管": ["trumpet", "trombone", "tuba", "french_horn", "brass_section"],
  "木管": ["oboe", "english_horn", "bassoon", "clarinet", "flutes", "soprano_and_alto_sax", "tenor_sax", "baritone_sax"],
  "萨克斯": ["soprano_and_alto_sax", "tenor_sax", "baritone_sax"],
  "打击乐": ["drums", "timpani", "chromatic_percussion"],
  "合成器": ["synth_strings", "synth_lead", "synth_pad"],
  "人声": ["voice"],
};

/** Final id -> alias-terms map, merging families and per-instrument names. */
const ALIASES: Record<string, string[]> = (() => {
  const out: Record<string, Set<string>> = {};
  for (const [term, ids] of Object.entries(FAMILIES)) {
    for (const id of ids) (out[id] ??= new Set()).add(term);
  }
  for (const [id, terms] of Object.entries(SPECIFIC)) {
    for (const t of terms) (out[id] ??= new Set()).add(t);
  }
  for (const [id, terms] of Object.entries(ZH_ALIASES)) {
    for (const t of terms) (out[id] ??= new Set()).add(t);
  }
  for (const [term, ids] of Object.entries(ZH_FAMILIES)) {
    for (const id of ids) (out[id] ??= new Set()).add(term);
  }
  return Object.fromEntries(
    Object.entries(out).map(([id, set]) => [id, [...set]]),
  );
})();

/** Display form of an instrument id ("electric_bass" -> "electric bass").
 *  When locale is "zh", returns "中文名 (English)" format. */
export function label(name: string, locale?: string): string {
  if (locale === "zh") {
    const cn = ZH_LABELS[name];
    const en = name.replace(/_/g, " ");
    return cn ? `${cn} (${en})` : en;
  }
  return name.replace(/_/g, " ");
}

/** Short label for compact display (Chinese only, no English in parens). */
export function shortLabel(name: string, locale?: string): string {
  if (locale === "zh") {
    return ZH_LABELS[name] ?? name.replace(/_/g, " ");
  }
  return name.replace(/_/g, " ");
}

/** Chinese display names for instruments. */
const ZH_LABELS: Record<string, string> = {
  acoustic_piano: "原声钢琴",
  electric_piano: "电钢琴",
  chromatic_percussion: "色彩打击乐",
  organ: "风琴",
  acoustic_guitar: "原声吉他",
  clean_electric_guitar: "清音电吉他",
  distorted_electric_guitar: "失真电吉他",
  acoustic_bass: "原声贝斯",
  electric_bass: "电贝斯",
  violin: "小提琴",
  viola: "中提琴",
  cello: "大提琴",
  contrabass: "低音提琴",
  orchestral_harp: "竖琴",
  timpani: "定音鼓",
  string_ensemble: "弦乐合奏",
  synth_strings: "合成弦乐",
  voice: "人声",
  orchestra_hit: "交响乐团重音",
  trumpet: "小号",
  trombone: "长号",
  tuba: "大号",
  french_horn: "圆号",
  brass_section: "铜管合奏",
  soprano_and_alto_sax: "高音/中音萨克斯",
  tenor_sax: "次中音萨克斯",
  baritone_sax: "上低音萨克斯",
  oboe: "双簧管",
  english_horn: "英国管",
  bassoon: "巴松管",
  clarinet: "单簧管",
  flutes: "长笛",
  synth_lead: "合成主音",
  synth_pad: "合成铺底",
  drums: "鼓组",
};

/** True if every char of `q` appears in `text` in order (typo-tolerant). */
function isSubsequence(q: string, text: string): boolean {
  let i = 0;
  for (let j = 0; j < text.length && i < q.length; j++) {
    if (text[j] === q[i]) i++;
  }
  return i === q.length;
}

/**
 * Score `name` against `query` for ranking; 0 means no match. Higher is a
 * tighter match: exact label > label prefix > label substring > alias hits >
 * subsequence (typo) fallback.
 */
export function scoreInstrument(name: string, query: string): number {
  const q = query.trim().toLowerCase();
  if (q === "") return 1;

  const text = label(name).toLowerCase();
  if (text === q) return 100;
  if (text.startsWith(q)) return 80;
  if (text.includes(q)) return 60;

  let best = 0;
  for (const alias of ALIASES[name] ?? []) {
    if (alias === q) best = Math.max(best, 55);
    else if (alias.startsWith(q)) best = Math.max(best, 45);
    else if (alias.includes(q)) best = Math.max(best, 40);
  }
  if (best > 0) return best;

  // Typo tolerance — only for queries long enough to be meaningful.
  if (q.length >= 3) {
    if (isSubsequence(q, text)) return 20;
    for (const alias of ALIASES[name] ?? []) {
      if (isSubsequence(q, alias)) return 15;
    }
  }
  return 0;
}

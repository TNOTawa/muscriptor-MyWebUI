import type { Locale } from "./context";

/** 乐器 ID → 中文名称映射 */
const INSTRUMENT_ZH: Record<string, string> = {
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

/** 中文搜索别名：中文族名 + 中文俗称，用于中文模糊搜索 */
const ZH_ALIASES: Record<string, string[]> = {
  acoustic_piano: ["原声钢琴", "三角钢琴", "立式钢琴", "大钢琴"],
  electric_piano: ["电钢琴", "电子钢琴", "柔和的电钢琴", "沃利策", "电钢"],
  chromatic_percussion: ["色彩打击乐", "颤音琴", "马林巴", "木琴", "钟琴", "钢片琴"],
  organ: ["风琴", "管风琴", "电子管风琴", "哈蒙德风琴", "手风琴"],
  acoustic_guitar: ["原声吉他", "尼龙弦吉他", "钢弦吉他", "木吉他"],
  clean_electric_guitar: ["清音电吉他", "电吉他清音", "干净的电吉他"],
  distorted_electric_guitar: ["失真电吉他", "失真吉他", "过载吉他", "重金属吉他"],
  acoustic_bass: ["原声贝斯", "低音提琴", "大贝斯", "木贝斯"],
  electric_bass: ["电贝斯", "贝斯吉他", "电低音吉他"],
  violin: ["小提琴", "提琴", "弦乐"],
  viola: ["中提琴"],
  cello: ["大提琴"],
  contrabass: ["低音提琴", "倍大提琴", "大贝斯"],
  orchestral_harp: ["竖琴", "管弦竖琴"],
  timpani: ["定音鼓", "铜鼓"],
  string_ensemble: ["弦乐合奏", "弦乐组", "弦乐群"],
  synth_strings: ["合成弦乐", "弦乐铺底", "合成器弦乐"],
  voice: ["人声", "歌声", "歌手", "合唱", "人声合唱", "哼唱"],
  orchestra_hit: ["交响乐团重音", "乐团重击", "管弦重音"],
  trumpet: ["小号", "喇叭"],
  trombone: ["长号", "拉管"],
  tuba: ["大号"],
  french_horn: ["圆号", "法国号"],
  brass_section: ["铜管合奏", "铜管组", "铜管乐"],
  soprano_and_alto_sax: ["高音萨克斯", "中音萨克斯", "萨克斯高音"],
  tenor_sax: ["次中音萨克斯", "次中音萨克斯管"],
  baritone_sax: ["上低音萨克斯", "低音萨克斯"],
  oboe: ["双簧管", "欧伯"],
  english_horn: ["英国管"],
  bassoon: ["巴松管", "大管", "低音管"],
  clarinet: ["单簧管", "黑管", "竖笛"],
  flutes: ["长笛", "笛子", "短笛"],
  synth_lead: ["合成主音", "主音合成器", "旋律合成"],
  synth_pad: ["合成铺底", "铺底音色", "氛围合成"],
  drums: ["鼓组", "架子鼓", "鼓", "打击乐"],
};

/** 中文族名分组 → 覆盖的乐器 ID（用于中文分类搜索） */
const ZH_FAMILIES: Record<string, string[]> = {
  键盘: ["acoustic_piano", "electric_piano", "organ"],
  钢琴: ["acoustic_piano", "electric_piano"],
  吉他: ["acoustic_guitar", "clean_electric_guitar", "distorted_electric_guitar"],
  贝斯: ["acoustic_bass", "electric_bass", "contrabass"],
  弦乐: ["violin", "viola", "cello", "contrabass", "orchestral_harp", "string_ensemble", "synth_strings"],
  管弦乐: [
    "violin", "viola", "cello", "contrabass", "orchestral_harp", "timpani",
    "string_ensemble", "french_horn", "trumpet", "trombone", "tuba",
    "oboe", "english_horn", "bassoon", "clarinet", "flutes",
  ],
  铜管: ["trumpet", "trombone", "tuba", "french_horn", "brass_section"],
  木管: ["oboe", "english_horn", "bassoon", "clarinet", "flutes", "soprano_and_alto_sax", "tenor_sax", "baritone_sax"],
  萨克斯: ["soprano_and_alto_sax", "tenor_sax", "baritone_sax"],
  打击乐: ["drums", "timpani", "chromatic_percussion"],
  合成器: ["synth_strings", "synth_lead", "synth_pad"],
  人声: ["voice"],
};

export { INSTRUMENT_ZH, ZH_ALIASES, ZH_FAMILIES };

/** 根据语言返回乐器的显示名称，格式：中文名 (English Name) */
export function instrumentLabel(name: string, locale: Locale): string {
  if (locale === "zh") {
    const cn = INSTRUMENT_ZH[name];
    const en = name.replace(/_/g, " ");
    return cn ? `${cn} (${en})` : en;
  }
  return name.replace(/_/g, " ");
}

/** 仅返回当前语言的名称（不含括号备注），用于标签等紧凑场景 */
export function shortInstrumentLabel(name: string, locale: Locale): string {
  if (locale === "zh") {
    const cn = INSTRUMENT_ZH[name];
    return cn ?? name.replace(/_/g, " ");
  }
  return name.replace(/_/g, " ");
}

/** 将中文别名及分组合并到 English ALIASES 中以支持中文搜索 */
export function mergeZhAliases(
  existingAliases: Record<string, string[]>,
  existingFamilies: Record<string, string[]>,
): Record<string, string[]> {
  const merged: Record<string, Set<string>> = {};
  for (const [id, terms] of Object.entries(existingAliases)) {
    (merged[id] ??= new Set()).add(id);
    for (const t of terms) (merged[id] as Set<string>).add(t);
  }
  for (const [term, ids] of Object.entries(existingFamilies)) {
    for (const id of ids) (merged[id] ??= new Set()).add(term);
  }
  for (const [id, terms] of Object.entries(ZH_ALIASES)) {
    (merged[id] ??= new Set()).add(id);
    for (const t of terms) (merged[id] as Set<string>).add(t);
  }
  for (const [term, ids] of Object.entries(ZH_FAMILIES)) {
    for (const id of ids) (merged[id] ??= new Set()).add(term);
  }
  return Object.fromEntries(
    Object.entries(merged).map(([id, set]) => [id, [...set]]),
  );
}

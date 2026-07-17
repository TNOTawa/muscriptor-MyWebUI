import clsx from "clsx";
import { useI18n, type Locale } from "../i18n/context";
import { Button } from "./Button";

const LABELS: Record<Locale, string> = { en: "EN", zh: "中文" };

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 ml-3">
      {(["en", "zh"] as Locale[]).map((l) => (
        <Button
          key={l}
          kind={locale === l ? "primary" : "ghost"}
          pad="px-2 py-0.5"
          className={clsx(
            "text-[11px] font-semibold leading-relaxed transition-colors",
            locale === l
              ? "border-accent bg-accent text-white hover:border-accent hover:bg-accent"
              : "text-muted hover:text-content",
          )}
          onClick={() => setLocale(l)}
        >
          {LABELS[l]}
        </Button>
      ))}
    </div>
  );
}

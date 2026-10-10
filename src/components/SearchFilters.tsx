import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, LEVELS, type Listing } from "@/lib/listings";

export type JobSearch = { q?: string | undefined; city?: string | undefined; cat?: string | undefined; start?: string | undefined; level?: string | undefined; sort?: "new" | "deadline" | "start" | undefined };

export function startOptions(list: Listing[]) {
  return [...new Set(list.map((l) => l.start_date?.slice(0, 7)).filter(Boolean) as string[])].sort();
}

const sel = "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function SearchFilters({ initial, listings, compact }: { initial: JobSearch; listings: Listing[]; compact?: boolean }) {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const [s, setS] = useState<JobSearch>(initial);
  const cities = [...new Set(listings.map((l) => l.city))].sort();
  const set = (k: keyof JobSearch, v: string) => setS((p) => ({ ...p, [k]: v || undefined }));
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); nav({ to: "/jobs", search: s }); }}
      className={`rounded-2xl border bg-card p-4 shadow-card ${compact ? "" : "md:p-5"}`}
    >
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">{t("search_ph")}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={s.q ?? ""} onChange={(e) => set("q", e.target.value)} placeholder={t("search_ph")} className={`${sel} pl-9`} />
        </label>
        <button className="h-11 rounded-lg bg-success px-6 text-sm font-semibold text-success-foreground hover:bg-success/90">{t("search")}</button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <select aria-label={t("city")} className={sel} value={s.city ?? ""} onChange={(e) => set("city", e.target.value)}>
          <option value="">{t("city")}: {t("all")}</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select aria-label={t("profession")} className={sel} value={s.cat ?? ""} onChange={(e) => set("cat", e.target.value)}>
          <option value="">{t("profession")}: {t("all")}</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name[lang]}</option>)}
        </select>
        <select aria-label={t("start")} className={sel} value={s.start ?? ""} onChange={(e) => set("start", e.target.value)}>
          <option value="">{t("start")}: {t("any_start")}</option>
          {startOptions(listings).map((m) => (
            <option key={m} value={m}>{new Date(m + "-01").toLocaleDateString(lang, { month: "long", year: "numeric" })}</option>
          ))}
        </select>
        <select aria-label={t("level")} className={sel} value={s.level ?? ""} onChange={(e) => set("level", e.target.value)}>
          <option value="">{t("level")}: {t("all")}</option>
          {LEVELS.map((l) => <option key={l} value={l}>≤ {l}</option>)}
        </select>
      </div>
    </form>
  );
}

export function applyFilters(list: Listing[], s: JobSearch) {
  const q = s.q?.toLowerCase().trim();
  let r = list.filter((l) =>
    (!q || [l.title, l.profession, l.employer].some((x) => x.toLowerCase().includes(q))) &&
    (!s.city || l.city === s.city) &&
    (!s.cat || l.category === s.cat) &&
    (!s.start || l.start_date?.startsWith(s.start)) &&
    (!s.level || LEVELS.indexOf(l.german_level) <= LEVELS.indexOf(s.level)),
  );
  const key = s.sort === "deadline" ? "deadline" : s.sort === "start" ? "start_date" : null;
  if (key) r = [...r].sort((a, b) => (a[key] ?? "9999").localeCompare(b[key] ?? "9999"));
  return r;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, FileText, Send, Plane } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, listingsQuery } from "@/lib/listings";
import { JobCard } from "@/components/JobCard";
import { SearchFilters } from "@/components/SearchFilters";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AzubiAfrica – Finde deine Ausbildung in Deutschland" },
      { name: "description", content: "Ausbildungsplätze in Deutschland für Bewerberinnen und Bewerber aus ganz Afrika – direkt beim Unternehmen bewerben." },
      { property: "og:title", content: "AzubiAfrica – Finde deine Ausbildung in Deutschland" },
      { property: "og:description", content: "Entdecke duale Ausbildungsplätze in Deutschland und bewirb dich direkt beim Arbeitgeber." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const { data = [] } = useQuery(listingsQuery);
  const featured = data.filter((l) => l.is_featured).slice(0, 3);
  const recent = data.slice(0, 6);
  const steps = [
    { i: Search, t: t("how_1_t"), d: t("how_1_d") },
    { i: FileText, t: t("how_2_t"), d: t("how_2_d") },
    { i: Send, t: t("how_3_t"), d: t("how_3_d") },
    { i: Plane, t: t("how_4_t"), d: t("how_4_d") },
  ];
  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 md:pt-24">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success-foreground/90">Ausbildung · Deutschland · Afrika</span>
            <h1 className="mt-5 text-4xl font-bold md:text-6xl">{t("hero_title")}</h1>
            <p className="mt-5 text-lg opacity-85">{t("hero_sub")}</p>
          </div>
        </div>
      </section>
      <div className="mx-auto -mt-16 max-w-5xl px-4">
        <SearchFilters initial={{}} listings={data} />
        <p className="mt-3 text-center text-xs text-muted-foreground">{t("demo_notice")}</p>
      </div>

      <Section title={t("featured")}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featured.map((j) => <JobCard key={j.id} job={j} />)}</div>
      </Section>

      <Section title={t("categories")} muted>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((c) => {
            const n = data.filter((l) => l.category === c.id).length;
            return (
              <Link key={c.id} to="/jobs" search={{ cat: c.id }} className="flex items-center gap-3 rounded-xl border bg-card p-4 transition hover:border-success/50 hover:shadow-card">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"><c.icon className="h-5 w-5" /></span>
                <span><span className="block text-sm font-semibold">{c.name[lang]}</span><span className="text-xs text-muted-foreground">{n}</span></span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title={t("recent")}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recent.map((j) => <JobCard key={j.id} job={j} />)}</div>
      </Section>

      <Section title={t("how_title")} muted>
        <ol className="grid gap-5 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={i} className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <s.i className="h-5 w-5 text-success" />
              </div>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-hero p-8 text-primary-foreground md:flex-row md:items-center md:p-12">
          <div><h2 className="text-2xl font-bold md:text-3xl">{t("cta_title")}</h2><p className="mt-2 opacity-85">{t("cta_sub")}</p></div>
          <Link to="/jobs" className="inline-flex items-center gap-2 rounded-lg bg-success px-6 py-3 font-semibold text-success-foreground hover:bg-success/90">{t("explore_all")} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}

function Section({ title, children, muted }: { title: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <section className={muted ? "bg-secondary/60" : ""}>
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-7 text-2xl font-bold text-primary md:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

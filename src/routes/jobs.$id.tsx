import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, MapPin, CalendarDays, Euro, Languages, Clock, ShieldCheck, Globe, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, fmtDate, listingQuery } from "@/lib/listings";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Ausbildungsplatz – Details | AzubiAfrica" },
      { name: "description", content: "Details zum Ausbildungsplatz: Anforderungen, Deutschniveau, Ausbildungsbeginn und Bewerbung beim Unternehmen." },
      { property: "og:title", content: "Ausbildungsplatz – Details | AzubiAfrica" },
      { property: "og:description", content: "Alle Infos zum Ausbildungsplatz und direkter Link zur Bewerbung beim Arbeitgeber." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { data: job, isLoading } = useQuery(listingQuery(id));
  if (isLoading) return <div className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">…</div>;
  if (!job) return <div className="mx-auto max-w-5xl px-4 py-16"><p>{t("none")}</p><Link to="/jobs" className="text-success underline">{t("back")}</Link></div>;
  const cat = CATEGORIES.find((c) => c.id === job.category);
  const facts = [
    { i: MapPin, k: t("location"), v: `${job.postal_code} ${job.city}` },
    { i: CalendarDays, k: t("start"), v: fmtDate(job.start_date, lang) },
    { i: Clock, k: t("deadline"), v: fmtDate(job.deadline, lang) },
    { i: Euro, k: t("salary"), v: job.salary || t("not_given") },
    { i: Languages, k: t("level"), v: job.german_level },
    { i: ShieldCheck, k: t("verified"), v: fmtDate(job.last_verified, lang) },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{t("back")}</Link>
      {job.is_demo && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-warning p-3 text-sm text-warning-foreground"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{t("demo_notice")}</div>
      )}
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-success">{cat?.name[lang]}</p>
          <h1 className="mt-1 text-3xl font-bold text-primary md:text-4xl">{job.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{job.profession} · <span className="font-medium text-foreground">{job.employer}</span></p>
          <h2 className="mt-8 text-xl font-semibold">{t("description")}</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/85">{job.description}</p>
          <h2 className="mt-8 text-xl font-semibold">{t("requirements")}</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/85">{job.requirements}</p>
          <h2 className="mt-8 text-xl font-semibold">{t("intl")}</h2>
          <p className={`mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${job.international_verified ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
            <Globe className="h-4 w-4" />{job.international_verified ? t("intl_yes") : t("intl_unknown")}
          </p>
        </div>
        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">{t("employer")}</p>
          <p className="font-semibold">{job.employer}</p>
          <dl className="mt-5 space-y-3">
            {facts.map((f) => (
              <div key={f.k} className="flex items-start gap-3 text-sm">
                <f.i className="mt-0.5 h-4 w-4 text-success" />
                <div><dt className="text-muted-foreground">{f.k}</dt><dd className="font-medium">{f.v}</dd></div>
              </div>
            ))}
          </dl>
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-success px-4 py-3.5 text-center font-semibold text-success-foreground hover:bg-success/90">
            {t("apply_now")} <ExternalLink className="h-4 w-4" />
          </a>
          <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="mt-3 block break-all text-xs text-muted-foreground underline">
            {t("source")}: {job.source_url}
          </a>
        </aside>
      </div>
    </div>
  );
}

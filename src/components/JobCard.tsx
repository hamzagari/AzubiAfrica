import { Link } from "@tanstack/react-router";
import { MapPin, CalendarDays, Euro, Languages, Clock, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, fmtDate, type Listing } from "@/lib/listings";

export function JobCard({ job }: { job: Listing }) {
  const { t, lang } = useI18n();
  const cat = CATEGORIES.find((c) => c.id === job.category);
  const Icon = cat?.icon;
  return (
    <article className="group flex flex-col rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-success/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {job.is_demo && (
          <span className="rounded-full bg-warning px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">{t("demo_badge")}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold leading-snug text-foreground">{job.title}</h3>
      <p className="text-sm text-muted-foreground">{job.profession}</p>
      <p className="mt-1 text-sm font-medium text-primary">{job.employer}</p>
      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <Row icon={MapPin} v={`${job.postal_code} ${job.city}`} />
        <Row icon={CalendarDays} v={`${t("start")}: ${fmtDate(job.start_date, lang)}`} />
        <Row icon={Euro} v={job.salary || t("not_given")} />
        <Row icon={Languages} v={`${t("level")}: ${job.german_level}`} />
        <Row icon={Clock} v={`${t("deadline")}: ${fmtDate(job.deadline, lang)}`} />
        <Row icon={ShieldCheck} v={`${t("verified")}: ${fmtDate(job.last_verified, lang)}`} />
      </dl>
      <Link
        to="/jobs/$id"
        params={{ id: job.id }}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition group-hover:bg-primary/90"
      >
        {t("details")}
      </Link>
    </article>
  );
}

function Row({ icon: I, v }: { icon: typeof MapPin; v: string }) {
  return (
    <div className="flex items-center gap-2">
      <I className="h-4 w-4 shrink-0 text-success" />
      <span className="truncate">{v}</span>
    </div>
  );
}

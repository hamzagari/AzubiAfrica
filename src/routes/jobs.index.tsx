import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { listingsQuery } from "@/lib/listings";
import { JobCard } from "@/components/JobCard";
import { SearchFilters, applyFilters, type JobSearch } from "@/components/SearchFilters";

export const Route = createFileRoute("/jobs/")({
  validateSearch: (s: Record<string, unknown>): JobSearch => ({
    q: (s["q"] as string) || undefined,
    city: (s["city"] as string) || undefined,
    cat: (s["cat"] as string) || undefined,
    start: (s["start"] as string) || undefined,
    level: (s["level"] as string) || undefined,
    sort: (["new", "deadline", "start"].includes(s["sort"] as string) ? s["sort"] : undefined) as JobSearch["sort"],
  }),
  head: () => ({
    meta: [
      { title: "Ausbildungsplätze in Deutschland – AzubiAfrica" },
      { name: "description", content: "Alle Ausbildungsplätze filtern nach Stadt, Beruf, Ausbildungsbeginn und Deutschniveau." },
      { property: "og:title", content: "Ausbildungsplätze – AzubiAfrica" },
      { property: "og:description", content: "Filtere Ausbildungsplätze in Deutschland nach Stadt, Beruf und Deutschniveau." },
    ],
  }),
  component: Jobs,
});

function Jobs() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const nav = useNavigate({ from: "/jobs/" });
  const { data = [], isLoading } = useQuery(listingsQuery);
  const results = applyFilters(data, search);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-primary">{t("nav_jobs")}</h1>
      <SearchFilters key={JSON.stringify(search)} initial={search} listings={data} compact />
      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground"><strong className="text-foreground">{results.length}</strong> {t("results")}</p>
        <div className="flex items-center gap-3">
          <Link to="/jobs" search={{}} className="text-sm text-muted-foreground underline-offset-2 hover:underline">{t("reset")}</Link>
          <label className="flex items-center gap-2 text-sm">
            {t("sort")}
            <select className="h-9 rounded-lg border bg-card px-2" value={search.sort ?? "new"}
              onChange={(e) => nav({ search: (p) => ({ ...p, sort: e.target.value as JobSearch["sort"] }) })}>
              <option value="new">{t("sort_new")}</option>
              <option value="deadline">{t("sort_deadline")}</option>
              <option value="start">{t("sort_start")}</option>
            </select>
          </label>
        </div>
      </div>
      {isLoading ? <p className="text-muted-foreground">…</p> : results.length === 0 ? (
        <p className="rounded-xl border bg-card p-10 text-center text-muted-foreground">{t("none")}</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{results.map((j) => <JobCard key={j.id} job={j} />)}</div>
      )}
    </div>
  );
}

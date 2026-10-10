import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, FileText, Send, Plane, Languages, ShieldAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/how-to-apply")({
  head: () => ({
    meta: [
      { title: "Bewerben aus Afrika – So geht's | AzubiAfrica" },
      { name: "description", content: "Schritt für Schritt: Ausbildung in Deutschland finden, Unterlagen vorbereiten und direkt beim Unternehmen bewerben." },
      { property: "og:title", content: "Bewerben aus Afrika – AzubiAfrica" },
      { property: "og:description", content: "Leitfaden für Bewerberinnen und Bewerber aus Afrika für eine Ausbildung in Deutschland." },
    ],
  }),
  component: HowTo,
});

function HowTo() {
  const { t } = useI18n();
  const steps = [
    { i: Search, a: t("how_1_t"), b: t("how_1_d") },
    { i: FileText, a: t("how_2_t"), b: t("how_2_d") },
    { i: Send, a: t("how_3_t"), b: t("how_3_d") },
    { i: Plane, a: t("how_4_t"), b: t("how_4_d") },
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary md:text-4xl">{t("how_title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("how_page_intro")}</p>
      <ol className="mt-10 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4 rounded-xl border bg-card p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
            <div><h2 className="flex items-center gap-2 font-semibold"><s.i className="h-4 w-4 text-success" />{s.a}</h2><p className="mt-1 text-muted-foreground">{s.b}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6"><h2 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-success" />{t("how_docs")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("how_docs_list")}</p></div>
        <div className="rounded-xl border bg-card p-6"><h2 className="flex items-center gap-2 font-semibold"><Languages className="h-4 w-4 text-success" />{t("how_lang")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("how_lang_d")}</p></div>
      </div>
      <div className="mt-5 rounded-xl border border-warning bg-warning/40 p-6"><h2 className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-4 w-4" />{t("how_visa")}</h2><p className="mt-2 text-sm">{t("how_visa_d")}</p></div>
      <Link to="/jobs" className="mt-10 inline-flex rounded-lg bg-success px-6 py-3 font-semibold text-success-foreground">{t("explore_all")}</Link>
    </div>
  );
}

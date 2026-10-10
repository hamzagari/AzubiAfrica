import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, LEVELS, fmtDate, type Listing } from "@/lib/listings";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin – Inserate verwalten | AzubiAfrica" },
      { name: "description", content: "Verwaltungsbereich für Ausbildungsinserate." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin – AzubiAfrica" },
      { property: "og:description", content: "Verwaltungsbereich für Ausbildungsinserate." },
    ],
  }),
  component: Admin,
});

const input = "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm";

function Admin() {
  const { t } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin", session?.user.id],
    enabled: !!session,
    queryFn: async () => (await supabase.rpc("has_role", { _user_id: session!.user.id, _role: "admin" })).data ?? false,
  });
  if (!ready) return null;
  if (!session) return <AuthForm />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Admin</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted-foreground underline">{t("logout")}</button>
      </div>
      {isLoading ? null : isAdmin ? <Dashboard /> : (
        <p className="rounded-xl border bg-card p-6 text-muted-foreground">Kein Admin-Zugriff für {session.user.email}.</p>
      )}
    </div>
  );
}

function AuthForm() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error, data } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password: pw })
      : await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin + "/admin" } });
    if (error) return toast.error(error.message);
    if (mode === "up" && !data.session) toast.success("Bitte E-Mail bestätigen.");
    return undefined;
  };
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-primary">{mode === "in" ? t("login") : t("signup")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Admin-Bereich. Das erste registrierte Konto erhält Admin-Rechte.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input className={input} type="email" required placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" required minLength={6} placeholder="Passwort" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{mode === "in" ? t("login") : t("signup")}</button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-success underline">
        {mode === "in" ? t("signup") : t("login")}
      </button>
    </div>
  );
}

const empty: TablesInsert<"listings"> = {
  title: "", profession: "", category: "pflege", employer: "", city: "", postal_code: "", start_date: null, deadline: null,
  salary: "", german_level: "B1", description: "", requirements: "", international_verified: false, apply_url: "", source_url: "",
  last_verified: new Date().toISOString().slice(0, 10), is_demo: false, is_featured: false, published: true,
};

function Dashboard() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => (await supabase.from("listings").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [edit, setEdit] = useState<TablesInsert<"listings"> | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-listings"] }); qc.invalidateQueries({ queryKey: ["listings"] }); };
  const del = async (l: Listing) => {
    if (!confirm(`"${l.title}" löschen?`)) return;
    const { error } = await supabase.from("listings").delete().eq("id", l.id);
    error ? toast.error(error.message) : (toast.success("Gelöscht"), refresh());
  };
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setEdit({ ...empty })} className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-success-foreground"><Plus className="h-4 w-4" />Neues Inserat</button>
        <button onClick={() => setImportOpen(!importOpen)} className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold"><Upload className="h-4 w-4" />JSON-Import</button>
      </div>
      {importOpen && <Importer onDone={refresh} />}
      {edit && <EditForm value={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); refresh(); }} />}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left"><tr>{["Titel", "Arbeitgeber", "Stadt", "Frist", "Geprüft", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3"><Link to="/jobs/$id" params={{ id: l.id }} className="font-medium hover:underline">{l.title}</Link></td>
                <td className="px-4 py-3">{l.employer}</td>
                <td className="px-4 py-3">{l.city}</td>
                <td className="px-4 py-3">{fmtDate(l.deadline, "de")}</td>
                <td className="px-4 py-3">{fmtDate(l.last_verified, "de")}</td>
                <td className="px-4 py-3 text-xs">{l.published ? "Online" : "Entwurf"}{l.is_demo && " · Demo"}{l.is_featured && " · ★"} · {l.source_type}</td>
                <td className="px-4 py-3 text-right">
                  <button aria-label="Bearbeiten" onClick={() => setEdit(l)} className="p-1.5 text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button aria-label="Löschen" onClick={() => del(l)} className="p-1.5 text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EditForm({ value, onClose, onSaved }: { value: TablesInsert<"listings">; onClose: () => void; onSaved: () => void }) {
  const [v, setV] = useState(value);
  const set = (k: keyof typeof v, x: unknown) => setV((p) => ({ ...p, [k]: x }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const row = { ...v, start_date: v.start_date || null, deadline: v.deadline || null, updated_at: new Date().toISOString() };
    const { error } = v.id ? await supabase.from("listings").update(row).eq("id", v.id) : await supabase.from("listings").insert(row);
    error ? toast.error(error.message) : (toast.success("Gespeichert"), onSaved());
  };
  const txt = (k: keyof typeof v, label: string, type = "text", req = false) => (
    <label className="text-sm"><span className="mb-1 block font-medium">{label}</span>
      <input className={input} type={type} required={req} value={(v[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} /></label>
  );
  const chk = (k: keyof typeof v, label: string) => (
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!v[k]} onChange={(e) => set(k, e.target.checked)} />{label}</label>
  );
  return (
    <form onSubmit={save} className="mb-6 grid gap-4 rounded-xl border bg-card p-6 shadow-card md:grid-cols-2">
      <h2 className="text-lg font-semibold md:col-span-2">{v.id ? "Inserat bearbeiten" : "Neues Inserat"}</h2>
      {txt("title", "Titel", "text", true)}{txt("profession", "Ausbildungsberuf", "text", true)}
      {txt("employer", "Arbeitgeber", "text", true)}
      <label className="text-sm"><span className="mb-1 block font-medium">Kategorie</span>
        <select className={input} value={v.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name.de}</option>)}</select></label>
      {txt("city", "Stadt", "text", true)}{txt("postal_code", "PLZ")}
      {txt("start_date", "Ausbildungsbeginn", "date")}{txt("deadline", "Bewerbungsfrist", "date")}
      {txt("salary", "Ausbildungsvergütung")}
      <label className="text-sm"><span className="mb-1 block font-medium">Deutschniveau</span>
        <select className={input} value={v.german_level} onChange={(e) => set("german_level", e.target.value)}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></label>
      {txt("apply_url", "Bewerbungs-URL (offiziell)", "url", true)}{txt("source_url", "Quell-URL", "url", true)}
      {txt("last_verified", "Zuletzt geprüft", "date", true)}
      <div />
      <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Beschreibung</span>
        <textarea className={`${input} h-28 py-2`} value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} /></label>
      <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Anforderungen</span>
        <textarea className={`${input} h-24 py-2`} value={v.requirements ?? ""} onChange={(e) => set("requirements", e.target.value)} /></label>
      <div className="flex flex-wrap gap-5 md:col-span-2">
        {chk("published", "Veröffentlicht")}{chk("is_featured", "Hervorgehoben")}{chk("is_demo", "Demo-Inserat")}{chk("international_verified", "Internationale Bewerbung verifiziert")}
      </div>
      <div className="flex gap-2 md:col-span-2">
        <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Speichern</button>
        <button type="button" onClick={onClose} className="rounded-lg border px-5 py-2 text-sm">Abbrechen</button>
      </div>
    </form>
  );
}

function Importer({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [src, setSrc] = useState("api");
  const run = async () => {
    try {
      const arr = JSON.parse(text) as TablesInsert<"listings">[];
      if (!Array.isArray(arr)) throw new Error("JSON-Array erwartet");
      const rows = arr.map((r) => ({ ...r, source_type: src, is_demo: r.is_demo ?? false }));
      const { error } = await supabase.from("listings").upsert(rows, { onConflict: "source_type,external_id" });
      if (error) throw error;
      toast.success(`${rows.length} Inserate importiert`); setText(""); onDone();
    } catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="mb-6 rounded-xl border bg-card p-6">
      <h2 className="font-semibold">Import aus autorisierten Quellen</h2>
      <p className="mt-1 text-sm text-muted-foreground">Vorbereitung für API- oder RSS-Feeds: Füge ein JSON-Array von Inseraten ein. Einträge mit gleicher <code>external_id</code> werden aktualisiert. Nur Daten aus autorisierten Quellen importieren.</p>
      <select className={`${input} mt-3 max-w-xs`} value={src} onChange={(e) => setSrc(e.target.value)}>
        <option value="api">API</option><option value="rss">RSS</option><option value="manual">Manuell</option>
      </select>
      <textarea className={`${input} mt-3 h-40 py-2 font-mono text-xs`} value={text} onChange={(e) => setText(e.target.value)}
        placeholder='[{"external_id":"123","title":"...","profession":"...","category":"it","employer":"...","city":"Berlin","apply_url":"https://...","source_url":"https://..."}]' />
      <button onClick={run} className="mt-3 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Importieren</button>
    </div>
  );
}

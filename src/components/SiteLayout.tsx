import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/jobs", label: t("nav_jobs") },
    { to: "/how-to-apply", label: t("nav_how") },
    { to: "/admin", label: t("nav_admin") },
  ] as const;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></span>
            <span>Azubi<span className="text-success">Africa</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-primary bg-secondary" }}>{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-0.5" role="group" aria-label="Language">
              {(["de", "fr", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                  className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
              ))}
            </div>
            <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav className="border-t px-4 py-2 md:hidden">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">{l.label}</Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm">
          <p className="font-display text-lg font-bold">AzubiAfrica</p>
          <p className="mt-2 max-w-2xl opacity-80">{t("footer")}</p>
          <p className="mt-2 opacity-60">{t("demo_notice")}</p>
          <p className="mt-4 opacity-60">© {new Date().getFullYear()} AzubiAfrica</p>
        </div>
      </footer>
    </div>
  );
}

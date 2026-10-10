import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "de" | "fr" | "en";

const dict = {
  de: {
    nav_home: "Start", nav_jobs: "Ausbildungsplätze", nav_how: "Bewerben aus Afrika", nav_admin: "Admin",
    hero_title: "Finde deine Ausbildung in Deutschland",
    hero_sub: "AzubiAfrica hilft Bewerberinnen und Bewerbern aus ganz Afrika, duale Ausbildungsplätze in Deutschland zu entdecken – und sich direkt beim Unternehmen zu bewerben.",
    search_ph: "Beruf, Ausbildung oder Unternehmen", search: "Suchen",
    city: "Stadt", profession: "Beruf / Kategorie", start: "Ausbildungsbeginn", level: "Deutschniveau", deadline: "Bewerbungsfrist",
    all: "Alle", any_start: "Beliebig",
    featured: "Ausgewählte Ausbildungsplätze", categories: "Beliebte Kategorien", recent: "Neu hinzugefügt",
    explore_all: "Alle Ausbildungsplätze ansehen", details: "Details ansehen", verified: "Zuletzt geprüft",
    salary: "Ausbildungsvergütung", demo_badge: "Demo-Inserat",
    demo_notice: "Hinweis: Alle aktuell angezeigten Inserate sind gekennzeichnete Demo-Beispiele und keine echten Stellenangebote.",
    how_title: "So bewirbst du dich aus Afrika",
    how_1_t: "Ausbildung finden", how_1_d: "Durchsuche Angebote nach Beruf, Stadt und Deutschniveau.",
    how_2_t: "Unterlagen vorbereiten", how_2_d: "Lebenslauf, Anschreiben auf Deutsch, Zeugnisse und Sprachzertifikat.",
    how_3_t: "Direkt bewerben", how_3_d: "Bewirb dich über die offizielle Seite des Unternehmens.",
    how_4_t: "Visum beantragen", how_4_d: "Mit Ausbildungsvertrag beantragst du das Visum bei der deutschen Botschaft.",
    results: "Ergebnisse", sort: "Sortieren", sort_new: "Neueste", sort_deadline: "Frist (bald)", sort_start: "Beginn (früh)",
    reset: "Filter zurücksetzen", none: "Keine passenden Ausbildungsplätze gefunden.",
    employer: "Arbeitgeber", location: "Ort", description: "Beschreibung", requirements: "Anforderungen & Qualifikationen",
    intl: "Internationale Bewerbungen", intl_yes: "Verifiziert: internationale Bewerbungen möglich",
    intl_unknown: "Nicht verifiziert – bitte direkt beim Unternehmen erfragen.",
    source: "Originalquelle", apply_now: "Jetzt beim Unternehmen bewerben", not_given: "Keine Angabe",
    back: "Zurück zur Übersicht", login: "Anmelden", logout: "Abmelden", signup: "Registrieren",
    footer: "Unabhängiges Portal. Bewerbungen erfolgen ausschließlich über die offiziellen Seiten der Arbeitgeber.",
    cta_title: "Bereit für deinen Weg nach Deutschland?", cta_sub: "Entdecke alle verfügbaren Ausbildungsplätze.",
    how_page_intro: "Ein Überblick über die wichtigsten Schritte – von der Suche bis zur Einreise.",
    how_docs: "Typische Unterlagen", how_docs_list: "Lebenslauf (tabellarisch) · Anschreiben auf Deutsch · Schulzeugnisse mit Übersetzung · Deutsch-Zertifikat (z. B. Goethe, telc) · Reisepass",
    how_lang: "Deutschkenntnisse", how_lang_d: "Die meisten Ausbildungen verlangen B1, Pflegeberufe meist B2. Starte früh mit einem anerkannten Sprachkurs.",
    how_visa: "Visum & Anerkennung", how_visa_d: "Informiere dich auf offiziellen Seiten wie make-it-in-germany.com und bei der deutschen Botschaft in deinem Land. AzubiAfrica bietet keine Visum-Unterstützung an.",
  },
  fr: {
    nav_home: "Accueil", nav_jobs: "Formations", nav_how: "Postuler depuis l'Afrique", nav_admin: "Admin",
    hero_title: "Trouve ta formation en Allemagne",
    hero_sub: "AzubiAfrica aide les candidats de toute l'Afrique à découvrir des formations professionnelles (Ausbildung) en Allemagne et à postuler directement auprès de l'entreprise.",
    search_ph: "Métier, formation ou entreprise", search: "Rechercher",
    city: "Ville", profession: "Métier / Catégorie", start: "Début de formation", level: "Niveau d'allemand", deadline: "Date limite",
    all: "Tous", any_start: "Indifférent",
    featured: "Formations en vedette", categories: "Catégories populaires", recent: "Ajoutées récemment",
    explore_all: "Voir toutes les formations", details: "Voir les détails", verified: "Vérifié le",
    salary: "Rémunération", demo_badge: "Annonce démo",
    demo_notice: "Remarque : toutes les annonces affichées sont des exemples de démonstration et non de vraies offres.",
    how_title: "Comment postuler depuis l'Afrique",
    how_1_t: "Trouver une formation", how_1_d: "Filtre par métier, ville et niveau d'allemand.",
    how_2_t: "Préparer le dossier", how_2_d: "CV, lettre de motivation en allemand, diplômes et certificat de langue.",
    how_3_t: "Postuler directement", how_3_d: "Postule via le site officiel de l'entreprise.",
    how_4_t: "Demander le visa", how_4_d: "Avec le contrat de formation, demande le visa à l'ambassade d'Allemagne.",
    results: "résultats", sort: "Trier", sort_new: "Plus récentes", sort_deadline: "Date limite", sort_start: "Début",
    reset: "Réinitialiser", none: "Aucune formation trouvée.",
    employer: "Employeur", location: "Lieu", description: "Description", requirements: "Exigences et qualifications",
    intl: "Candidatures internationales", intl_yes: "Vérifié : candidatures internationales acceptées",
    intl_unknown: "Non vérifié – renseigne-toi directement auprès de l'entreprise.",
    source: "Source originale", apply_now: "Postuler maintenant chez l'entreprise", not_given: "Non indiqué",
    back: "Retour à la liste", login: "Connexion", logout: "Déconnexion", signup: "Inscription",
    footer: "Portail indépendant. Les candidatures se font uniquement via les sites officiels des employeurs.",
    cta_title: "Prêt pour ton parcours en Allemagne ?", cta_sub: "Découvre toutes les formations disponibles.",
    how_page_intro: "Les étapes essentielles – de la recherche à l'arrivée.",
    how_docs: "Documents habituels", how_docs_list: "CV · Lettre de motivation en allemand · Bulletins traduits · Certificat d'allemand (Goethe, telc) · Passeport",
    how_lang: "Niveau d'allemand", how_lang_d: "La plupart des formations exigent B1, les métiers de soins souvent B2.",
    how_visa: "Visa et reconnaissance", how_visa_d: "Consulte make-it-in-germany.com et l'ambassade d'Allemagne de ton pays. AzubiAfrica n'offre pas d'aide au visa.",
  },
  en: {
    nav_home: "Home", nav_jobs: "Apprenticeships", nav_how: "Apply from Africa", nav_admin: "Admin",
    hero_title: "Find your apprenticeship in Germany",
    hero_sub: "AzubiAfrica helps applicants across Africa discover vocational training (Ausbildung) in Germany and apply directly with the employer.",
    search_ph: "Job title, occupation or company", search: "Search",
    city: "City", profession: "Occupation / Category", start: "Training start", level: "German level", deadline: "Deadline",
    all: "All", any_start: "Any",
    featured: "Featured apprenticeships", categories: "Popular categories", recent: "Recently added",
    explore_all: "Explore all apprenticeships", details: "View details", verified: "Last verified",
    salary: "Training allowance", demo_badge: "Demo listing",
    demo_notice: "Note: all listings currently shown are labelled demo examples, not real job offers.",
    how_title: "How to apply from Africa",
    how_1_t: "Find a programme", how_1_d: "Filter by occupation, city and German level.",
    how_2_t: "Prepare documents", how_2_d: "CV, German cover letter, certificates and language certificate.",
    how_3_t: "Apply directly", how_3_d: "Apply through the employer's official website.",
    how_4_t: "Apply for a visa", how_4_d: "With a training contract, apply at the German embassy.",
    results: "results", sort: "Sort", sort_new: "Newest", sort_deadline: "Deadline (soonest)", sort_start: "Start (earliest)",
    reset: "Reset filters", none: "No matching apprenticeships found.",
    employer: "Employer", location: "Location", description: "Description", requirements: "Requirements & qualifications",
    intl: "International applicants", intl_yes: "Verified: international applicants accepted",
    intl_unknown: "Not verified – please ask the employer directly.",
    source: "Original source", apply_now: "Apply now with the employer", not_given: "Not specified",
    back: "Back to listings", login: "Sign in", logout: "Sign out", signup: "Sign up",
    footer: "Independent portal. Applications are made only via employers' official websites.",
    cta_title: "Ready for your path to Germany?", cta_sub: "Discover all available apprenticeships.",
    how_page_intro: "An overview of the key steps – from search to arrival.",
    how_docs: "Typical documents", how_docs_list: "CV · German cover letter · Translated school certificates · German certificate (Goethe, telc) · Passport",
    how_lang: "German skills", how_lang_d: "Most programmes require B1, nursing usually B2. Start a recognised course early.",
    how_visa: "Visa & recognition", how_visa_d: "Check official sources such as make-it-in-germany.com and the German embassy in your country. AzubiAfrica does not provide visa support.",
  },
} as const;

export type TKey = keyof typeof dict.de;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "de", setLang: () => {}, t: (k) => dict.de[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");
  useEffect(() => {
    const s = localStorage.getItem("lang") as Lang | null;
    if (s && s in dict) setLangState(s);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("lang", l); };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

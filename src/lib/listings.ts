import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Lang } from "./i18n";
import { HeartPulse, Laptop, Hammer, Cog, Truck, ChefHat, Briefcase, Zap, Factory, type LucideIcon } from "lucide-react";

export type Listing = Tables<"listings">;

export const CATEGORIES: { id: string; icon: LucideIcon; name: Record<Lang, string> }[] = [
  { id: "pflege", icon: HeartPulse, name: { de: "Pflege und Gesundheit", fr: "Soins et santé", en: "Nursing & Health" } },
  { id: "it", icon: Laptop, name: { de: "IT und Fachinformatik", fr: "Informatique", en: "IT & Computer Science" } },
  { id: "handwerk", icon: Hammer, name: { de: "Handwerk", fr: "Artisanat", en: "Skilled Trades" } },
  { id: "technik", icon: Cog, name: { de: "Technik und Mechatronik", fr: "Technique et mécatronique", en: "Engineering & Mechatronics" } },
  { id: "logistik", icon: Truck, name: { de: "Logistik", fr: "Logistique", en: "Logistics" } },
  { id: "gastro", icon: ChefHat, name: { de: "Gastronomie und Hotellerie", fr: "Restauration et hôtellerie", en: "Hospitality" } },
  { id: "kaufmaennisch", icon: Briefcase, name: { de: "Kaufmännische Berufe", fr: "Métiers commerciaux", en: "Business & Commerce" } },
  { id: "elektronik", icon: Zap, name: { de: "Elektronik", fr: "Électronique", en: "Electronics" } },
  { id: "produktion", icon: Factory, name: { de: "Produktion", fr: "Production", en: "Manufacturing" } },
];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export const listingsQuery = queryOptions({
  queryKey: ["listings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("listings").select("*").eq("published", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const listingQuery = (id: string) =>
  queryOptions({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export function fmtDate(d: string | null, lang: Lang) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(lang === "de" ? "de-DE" : lang === "fr" ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

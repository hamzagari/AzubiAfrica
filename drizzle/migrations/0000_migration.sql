CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- First registered user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_role AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  profession text NOT NULL,
  category text NOT NULL,
  employer text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL DEFAULT '',
  start_date date,
  deadline date,
  salary text,
  german_level text NOT NULL DEFAULT 'B1',
  description text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  international_verified boolean NOT NULL DEFAULT false,
  apply_url text NOT NULL,
  source_url text NOT NULL,
  last_verified date NOT NULL DEFAULT current_date,
  is_demo boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  source_type text NOT NULL DEFAULT 'manual',
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_type, external_id)
);
GRANT SELECT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published" ON public.listings FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin insert" ON public.listings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update" ON public.listings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete" ON public.listings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.listings (title, profession, category, employer, city, postal_code, start_date, deadline, salary, german_level, description, requirements, apply_url, source_url, is_featured, created_at) VALUES
('[DEMO] Ausbildung Pflegefachfrau/-mann','Pflegefachmann/-frau','pflege','Demo Klinikum Nord (Beispiel)','Hamburg','20095','2027-09-01','2027-05-31','1.340 € – 1.500 € / Monat','B2','Beispiel-Inserat. Dreijährige generalistische Pflegeausbildung mit Praxiseinsätzen in Krankenhaus, Altenpflege und ambulanter Pflege.','Mittlerer Schulabschluss oder gleichwertig; Deutschkenntnisse B2; Empathie und Teamfähigkeit.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',true, now()-interval '9 day'),
('[DEMO] Fachinformatiker für Anwendungsentwicklung','Fachinformatiker/in','it','Demo Software GmbH (Beispiel)','Berlin','10115','2027-08-01','2027-04-30','1.100 € – 1.300 € / Monat','B1','Beispiel-Inserat. Du lernst Softwareentwicklung, Datenbanken und agile Methoden.','Interesse an Programmierung; gute Mathematikkenntnisse; Deutsch B1.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',true, now()-interval '8 day'),
('[DEMO] Elektroniker für Energie- und Gebäudetechnik','Elektroniker/in','elektronik','Demo Elektro Müller (Beispiel)','München','80331','2027-09-01','2027-06-15','950 € – 1.200 € / Monat','B1','Beispiel-Inserat. Installation und Wartung elektrischer Anlagen in Gebäuden.','Technisches Verständnis; Schulabschluss; Deutsch B1.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',true, now()-interval '7 day'),
('[DEMO] Mechatroniker/in','Mechatroniker/in','technik','Demo Automotive AG (Beispiel)','Stuttgart','70173','2027-09-01','2027-03-31','1.150 € – 1.400 € / Monat','B1','Beispiel-Inserat. Montage und Instandhaltung mechatronischer Systeme.','Interesse an Technik und Elektronik; Deutsch B1.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',false, now()-interval '6 day'),
('[DEMO] Fachkraft für Lagerlogistik','Fachkraft für Lagerlogistik','logistik','Demo Logistikzentrum (Beispiel)','Leipzig','04109','2027-08-01','2027-06-30','900 € – 1.100 € / Monat','A2','Beispiel-Inserat. Warenannahme, Lagerung und Versand.','Zuverlässigkeit; körperliche Belastbarkeit; Deutsch A2–B1.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',false, now()-interval '5 day'),
('[DEMO] Koch/Köchin','Koch/Köchin','gastro','Demo Hotel am See (Beispiel)','Köln','50667','2027-08-01','2027-05-15','1.000 € – 1.150 € / Monat','A2','Beispiel-Inserat. Zubereitung von Speisen in einer gehobenen Hotelküche.','Freude am Kochen; Bereitschaft zu Schichtarbeit; Deutsch A2.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',true, now()-interval '4 day'),
('[DEMO] Kaufmann/-frau für Büromanagement','Kaufmann/-frau für Büromanagement','kaufmaennisch','Demo Handelshaus (Beispiel)','Frankfurt am Main','60311','2027-08-01','2027-04-15','1.000 € – 1.200 € / Monat','B2','Beispiel-Inserat. Organisation, Buchhaltung und Kundenkommunikation.','Gute Deutschkenntnisse B2; sicherer Umgang mit PC.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',false, now()-interval '3 day'),
('[DEMO] Anlagenmechaniker SHK','Anlagenmechaniker/in SHK','handwerk','Demo Haustechnik Schmidt (Beispiel)','Dortmund','44135','2027-08-01','2027-07-31','850 € – 1.100 € / Monat','A2','Beispiel-Inserat. Installation von Heizungs-, Sanitär- und Klimaanlagen.','Handwerkliches Geschick; Deutsch A2.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',false, now()-interval '2 day'),
('[DEMO] Maschinen- und Anlagenführer/in','Maschinen- und Anlagenführer/in','produktion','Demo Werk Hannover (Beispiel)','Hannover','30159','2027-09-01','2027-06-01','1.050 € – 1.250 € / Monat','B1','Beispiel-Inserat. Einrichten und Bedienen von Produktionsanlagen.','Technisches Interesse; Sorgfalt; Deutsch B1.','https://example.com/demo-bewerbung','https://example.com/demo-quelle',false, now()-interval '1 day');
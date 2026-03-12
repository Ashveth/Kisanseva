
CREATE TABLE public.farm_diary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  expense_amount NUMERIC(10,2),
  expense_currency TEXT DEFAULT '₹',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.farm_diary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own diary entries" ON public.farm_diary FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diary entries" ON public.farm_diary FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diary entries" ON public.farm_diary FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own diary entries" ON public.farm_diary FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_farm_diary_updated_at BEFORE UPDATE ON public.farm_diary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

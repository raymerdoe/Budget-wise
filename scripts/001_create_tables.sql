-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table for transaction categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_goals table
CREATE TABLE IF NOT EXISTS public.budget_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  amount DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, month, year)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for transactions
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update_own" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "transactions_delete_own" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for budget_goals
CREATE POLICY "budget_goals_select_own" ON public.budget_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "budget_goals_insert_own" ON public.budget_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "budget_goals_update_own" ON public.budget_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "budget_goals_delete_own" ON public.budget_goals FOR DELETE USING (auth.uid() = user_id);

-- Categories are public read, admin write (for now we'll allow all users to read)
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT TO authenticated USING (true);

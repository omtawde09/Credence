-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('investor', 'advisor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PORTFOLIOS
create table portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  total_value numeric default 0,
  cashflow numeric default 0,
  savings numeric default 0,
  equity_allocation numeric default 0, -- percent
  debt_allocation numeric default 0,   -- percent
  cash_allocation numeric default 0,   -- percent
  risk_level text default 'Unknown',
  advisor_name text,
  manager_name text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. GOALS
create table goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  status text check (status in ('On Track', 'At Risk', 'Behind', 'Completed')) default 'On Track',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. TRANSACTIONS
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  amount numeric not null, -- positive for credit, negative for debit
  type text check (type in ('credit', 'debit')),
  date timestamp with time zone default timezone('utc'::text, now()),
  category text
);

-- 5. INSIGHTS (for Portfolio Manager)
create table insights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  type text check (type in ('warning', 'info', 'success')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. SIPS (New for Enterprise)
create table sips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  asset_name text not null,
  amount numeric not null,
  frequency text check (frequency in ('Monthly', 'Quarterly', 'Annual')),
  status text check (status in ('Active', 'Paused', 'Stopped')) default 'Active',
  next_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. ADVISOR_NOTES (New for Audit Trail)
create table advisor_notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  note text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. HEALTH_SCORES
create table health_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  overall_score integer default 0,
  diversification_score integer default 0,
  risk_score integer default 0,
  goal_score integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES (Row Level Security)
-- Enable RLS
alter table profiles enable row level security;
alter table portfolios enable row level security;
alter table goals enable row level security;
alter table transactions enable row level security;
alter table insights enable row level security;
alter table health_scores enable row level security;
alter table sips enable row level security;
alter table advisor_notes enable row level security;

-- Policies (Users can only see/edit their own data)
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view own portfolio" on portfolios for select using (auth.uid() = user_id);
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can view own insights" on insights for select using (auth.uid() = user_id);
create policy "Users can view own health score" on health_scores for select using (auth.uid() = user_id);
create policy "Users can manage own sips" on sips for all using (auth.uid() = user_id);
create policy "Users can manage own notes" on advisor_notes for all using (auth.uid() = user_id);

-- TRIGGER to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Create empty portfolio entry
  insert into public.portfolios (user_id) values (new.id);
  
  -- Create empty health score
  insert into public.health_scores (user_id) values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

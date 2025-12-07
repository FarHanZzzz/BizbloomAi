-- Create the users table
create table public.users (
  id uuid not null primary key default gen_random_uuid(),
  email text not null unique,
  hashed_password text not null,
  profile jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update their own data"
  on public.users for update
  using ( auth.uid() = id );

-- Allow the backend (service role) to manage all users if needed, 
-- or ensure your backend uses the connection key that bypasses RLS (service_role key)
-- NOTE: If you are using the anon-key in the backend, you'll need policies that allow access.
-- However, for a backend API, it's best to use the SERVICE_ROLE_KEY if you want admin access,
-- OR use the standard client and rely on policies.
-- Since this is a simple self-hosted auth style, we might want to allow public insert for registration:

create policy "Anyone can register"
  on public.users for insert
  with check ( true );

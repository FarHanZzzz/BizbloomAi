create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    hashed_password text not null,
    profile jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists ideas (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    original_input text not null,
    refined_ideas jsonb not null,
    created_at timestamptz default now()
);

create table if not exists portfolios (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    idea_id uuid references ideas(id) on delete set null,
    market_insights jsonb,
    competitors jsonb,
    validation_scores jsonb,
    partners jsonb,
    pdf_url text,
    created_at timestamptz default now()
);

create table if not exists startup_embeddings (
    id bigserial primary key,
    name text,
    description text,
    embedding vector(384),
    metadata jsonb,
    success_flag int,
    created_at timestamptz default now()
);


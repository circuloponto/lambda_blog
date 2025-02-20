-- Create the posts table if it doesn't exist
create table if not exists public.posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    content text not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Create policies
drop policy if exists "Enable read access for all users" on posts;
drop policy if exists "Enable insert for authenticated users only" on posts;
drop policy if exists "Enable update for authenticated users only" on posts;
drop policy if exists "Enable delete for authenticated users only" on posts;

-- Allow anyone to read posts
create policy "Enable read access for all users" 
on public.posts for select 
using (true);

-- Allow authenticated users to create posts
create policy "Enable insert for authenticated users only" 
on public.posts for insert 
to authenticated 
with check (true);

-- Allow authenticated users to update posts
create policy "Enable update for authenticated users only" 
on public.posts for update 
to authenticated 
using (true);

-- Allow authenticated users to delete posts
create policy "Enable delete for authenticated users only" 
on public.posts for delete 
to authenticated 
using (true);

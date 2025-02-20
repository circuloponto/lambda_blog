-- Add user_id column to posts table
alter table public.posts 
add column if not exists user_id uuid references auth.users(id);

-- Update RLS policies to include user_id checks
drop policy if exists "Enable insert for authenticated users only" on posts;
drop policy if exists "Enable update for authenticated users only" on posts;
drop policy if exists "Enable delete for authenticated users only" on posts;

-- Allow authenticated users to create posts (with their user_id)
create policy "Enable insert for authenticated users only" 
on public.posts for insert 
to authenticated 
with check (auth.uid() = user_id);

-- Allow authenticated users to update their own posts
create policy "Enable update for authenticated users only" 
on public.posts for update 
to authenticated 
using (auth.uid() = user_id);

-- Allow authenticated users to delete their own posts
create policy "Enable delete for authenticated users only" 
on public.posts for delete 
to authenticated 
using (auth.uid() = user_id);

-- Create policies for storage
drop policy if exists "Give users access to own folder" on storage.objects;
drop policy if exists "Allow public read access" on storage.objects;

-- Allow authenticated users to upload files
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-images');

-- Allow public read access to files
create policy "Allow public read access"
on storage.objects for select
to public
using (bucket_id = 'blog-images');

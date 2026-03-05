-- SQL Script to setup trust_badges table and storage

-- 1. Create Storage Bucket
insert into storage.buckets (id, name, public)
values ('trust_badges', 'trust_badges', true)
on conflict (id) do nothing;

-- 2. Storage Policies
-- Allow public read access to the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'trust_badges' );

-- Allow authenticated admins to insert/update/delete
create policy "Admin Insert"
  on storage.objects for insert
  with check ( bucket_id = 'trust_badges' and auth.role() = 'authenticated' );

create policy "Admin Update"
  on storage.objects for update
  using ( bucket_id = 'trust_badges' and auth.role() = 'authenticated' );

create policy "Admin Delete"
  on storage.objects for delete
  using ( bucket_id = 'trust_badges' and auth.role() = 'authenticated' );

-- 3. Create Table
create table if not exists public.trust_badges (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    image_url text not null,
    display_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table public.trust_badges enable row level security;

-- 5. Table Policies
-- Public can read active badges
create policy "Public can view active trust badges"
    on public.trust_badges
    for select
    to public
    using (true); -- Allow reading all, frontend will filter by is_active

-- Authenticated users (Admins) can do everything
create policy "Admins can insert trust badges"
    on public.trust_badges
    for insert
    to authenticated
    with check (true);

create policy "Admins can update trust badges"
    on public.trust_badges
    for update
    to authenticated
    using (true)
    with check (true);

create policy "Admins can delete trust badges"
    on public.trust_badges
    for delete
    to authenticated
    using (true);

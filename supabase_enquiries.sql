-- Run this SQL in your Supabase project's SQL Editor to enable the Contact & Enquiry Comment Box feature.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_email text,
  subject text,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.enquiry_replies (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  admin_id uuid references auth.users(id) on delete set null,
  admin_name text not null default 'Team Admin',
  reply_text text not null,
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;
alter table public.enquiry_replies enable row level security;

-- Enquiries: anyone can view and submit; only admins can update or delete
create policy "Public can view enquiries"
  on public.enquiries
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can submit an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

create policy "Admins can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Enquiry Replies: anyone can view; only admins can insert, update, or delete
create policy "Public can view enquiry replies"
  on public.enquiry_replies
  for select
  to anon, authenticated
  using (true);

create policy "Admins can post enquiry replies"
  on public.enquiry_replies
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update enquiry replies"
  on public.enquiry_replies
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete enquiry replies"
  on public.enquiry_replies
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

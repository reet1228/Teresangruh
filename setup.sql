-- Teresangruh RSVP backend: run this in Supabase SQL Editor.
-- Replace the admin email below if the designated administrator changes.

create table if not exists public.wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  family_name text not null check (char_length(family_name) between 1 and 120),
  primary_phone text not null check (char_length(primary_phone) between 5 and 30),
  attendance text not null check (attendance in ('attending','declining')),
  guest_count integer not null default 0 check (guest_count between 0 and 12),
  guests jsonb not null default '[]'::jsonb,
  message text not null default '' check (char_length(message) <= 1500)
);

alter table public.wedding_rsvps enable row level security;

-- Public can submit a new RSVP, but cannot read, update, or delete records.
drop policy if exists "Guests can submit RSVP" on public.wedding_rsvps;
create policy "Guests can submit RSVP"
  on public.wedding_rsvps for insert to anon, authenticated
  with check (
    char_length(trim(family_name)) > 0
    and char_length(trim(primary_phone)) >= 5
    and jsonb_typeof(guests) = 'array'
    and jsonb_array_length(guests) <= 12
  );

-- Only the designated administrator can read/manage RSVP rows.
drop policy if exists "Admin can read RSVPs" on public.wedding_rsvps;
create policy "Admin can read RSVPs"
  on public.wedding_rsvps for select to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) = 'rithhinishacr7@gmail.com');

drop policy if exists "Admin can delete RSVPs" on public.wedding_rsvps;
create policy "Admin can delete RSVPs"
  on public.wedding_rsvps for delete to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) = 'rithhinishacr7@gmail.com');

drop policy if exists "Admin can update RSVPs" on public.wedding_rsvps;
create policy "Admin can update RSVPs"
  on public.wedding_rsvps for update to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) = 'rithhinishacr7@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email','')) = 'rithhinishacr7@gmail.com');

-- Private Aadhaar storage. The app must upload using a generated UUID path and
-- save only that storage path in the guest JSON. Never store Aadhaar numbers.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guest-aadhaar', 'guest-aadhaar', false, 5242880,
        array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

-- Guests may upload only; they cannot list, read, overwrite, or delete files.
drop policy if exists "Guest RSVP Aadhaar uploads" on storage.objects;
create policy "Guest RSVP Aadhaar uploads"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'guest-aadhaar');

-- Only the designated administrator can list/read/download Aadhaar documents.
drop policy if exists "Admin can read Aadhaar files" on storage.objects;
create policy "Admin can read Aadhaar files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'guest-aadhaar'
    and lower(coalesce(auth.jwt() ->> 'email','')) = 'rithhinishacr7@gmail.com'
  );

drop policy if exists "Admin can delete Aadhaar files" on storage.objects;
create policy "Admin can delete Aadhaar files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'guest-aadhaar'
    and lower(coalesce(auth.jwt() ->> 'email','')) = 'rithhinishacr7@gmail.com'
  );

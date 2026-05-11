-- ══════════════════════════════════════════════════════════════════
-- INVITATIONS TABLE
-- ══════════════════════════════════════════════════════════════════
create table public.invitations (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  slug          text        not null unique,
  theme_id      text        not null default 'champagne',
  language      text        not null default 'en' check (language in ('en', 'fr', 'ar')),
  status        text        not null default 'draft' check (status in ('draft', 'published')),
  event_details jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Fast slug lookups (public invitation page)
create index invitations_slug_idx    on public.invitations (slug);
-- Dashboard queries by owner
create index invitations_user_id_idx on public.invitations (user_id);

-- Auto-update updated_at on every update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger invitations_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

-- Enable RLS (required — table is in the public / exposed schema)
alter table public.invitations enable row level security;

-- Owners can read their own invitations (drafts + published)
create policy "owners can read own invitations"
  on public.invitations for select
  using (auth.uid() = user_id);

-- Anyone can read a published invitation (public /invitation/[slug] page)
create policy "public can read published invitations"
  on public.invitations for select
  using (status = 'published');

create policy "owners can insert own invitations"
  on public.invitations for insert
  with check (auth.uid() = user_id);

create policy "owners can update own invitations"
  on public.invitations for update
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owners can delete own invitations"
  on public.invitations for delete
  using (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════
-- GUESTS TABLE
-- ══════════════════════════════════════════════════════════════════
create table public.guests (
  id              uuid        primary key default gen_random_uuid(),
  invitation_id   uuid        not null references public.invitations(id) on delete cascade,
  name            text        not null,
  email           text,
  phone           text,
  rsvp_status     text        not null default 'pending'
                              check (rsvp_status in ('pending', 'attending', 'declined')),
  plus_one        boolean     not null default false,
  meal_preference text,
  message         text,
  responded_at    timestamptz,
  created_at      timestamptz not null default now(),
  -- Prevent duplicate RSVPs per invitation per email address
  constraint guests_invitation_email_unique unique (invitation_id, email)
);

create index guests_invitation_id_idx on public.guests (invitation_id);

alter table public.guests enable row level security;

-- Invitation owners can read their guest list
create policy "owners can read own guests"
  on public.guests for select
  using (
    exists (
      select 1 from public.invitations
      where id = guests.invitation_id
        and user_id = auth.uid()
    )
  );

-- Anyone can submit an RSVP for a published invitation
create policy "anyone can rsvp to published invitation"
  on public.guests for insert
  with check (
    exists (
      select 1 from public.invitations
      where id = guests.invitation_id
        and status = 'published'
    )
  );

-- Owners can correct guest records
create policy "owners can update own guests"
  on public.guests for update
  using (
    exists (
      select 1 from public.invitations
      where id = guests.invitation_id
        and user_id = auth.uid()
    )
  );

create policy "owners can delete own guests"
  on public.guests for delete
  using (
    exists (
      select 1 from public.invitations
      where id = guests.invitation_id
        and user_id = auth.uid()
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- GRANT DATA API ACCESS
-- Required because Supabase may not auto-expose new tables.
-- ══════════════════════════════════════════════════════════════════
grant select, insert, update, delete on public.invitations to authenticated;
grant select, insert               on public.guests        to anon;
grant select, insert, update, delete on public.guests      to authenticated;

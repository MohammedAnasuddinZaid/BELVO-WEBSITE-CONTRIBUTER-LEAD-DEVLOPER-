-- OS Question Bank Supabase Schema & Seeding Migration File
-- This SQL file can be copy-pasted directly into the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. Table: profiles
-- ==========================================
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    email text not null,
    role text not null check (role in ('admin', 'student')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. Table: topics
-- ==========================================
create table public.topics (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique
);

-- ==========================================
-- 3. Table: questions
-- ==========================================
create table public.questions (
    id uuid primary key default uuid_generate_v4(),
    question text not null,
    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,
    correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
    explanation text not null,
    difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
    topic_id uuid not null references public.topics(id) on delete cascade,
    marks integer not null,
    negative_marks numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. Table: tests
-- ==========================================
create table public.tests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    start_time timestamp with time zone default timezone('utc'::text, now()) not null,
    end_time timestamp with time zone,
    score numeric default 0.0 not null,
    negative_score numeric default 0.0 not null,
    total_marks numeric default 0.0 not null,
    status text not null check (status in ('ongoing', 'completed')),
    time_taken integer default 0 not null -- in seconds
);

-- ==========================================
-- 5. Table: answers
-- ==========================================
create table public.answers (
    id uuid primary key default uuid_generate_v4(),
    test_id uuid not null references public.tests(id) on delete cascade,
    question_id uuid not null references public.questions(id) on delete cascade,
    selected_option text check (selected_option in ('A', 'B', 'C', 'D')),
    is_correct boolean,
    marks_awarded numeric default 0.0 not null,
    negative_marks numeric default 0.0 not null,
    marked_for_review boolean default false
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.tests enable row level security;
alter table public.answers enable row level security;

-- Profiles Policies
create policy "Allow users to view their own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Allow users to update their own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Admin has full profile access" on public.profiles
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- Topics Policies
create policy "Authenticated users can read topics" on public.topics
    for select using (auth.role() = 'authenticated');

create policy "Admin can perform CRUD on topics" on public.topics
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- Questions Policies
create policy "Authenticated users can read questions" on public.questions
    for select using (auth.role() = 'authenticated');

create policy "Admin can perform CRUD on questions" on public.questions
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- Tests Policies
create policy "Students can view their own tests" on public.tests
    for select using (auth.uid() = user_id);

create policy "Students can insert their own tests" on public.tests
    for insert with check (auth.uid() = user_id);

create policy "Students can update their own tests" on public.tests
    for update using (auth.uid() = user_id);

create policy "Admin can view all tests" on public.tests
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- Answers Policies
create policy "Students can view their own test answers" on public.answers
    for select using (
        exists (select 1 from public.tests where id = test_id and user_id = auth.uid())
    );

create policy "Students can update/insert their own test answers" on public.answers
    for all using (
        exists (select 1 from public.tests where id = test_id and user_id = auth.uid())
    );

create policy "Admin can view all answers" on public.answers
    for select using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- ==========================================
-- INITIAL SEED DATA
-- ==========================================

-- Seed Topics
insert into public.topics (id, name) values
('a1111111-1111-1111-1111-111111111111', 'Process Management'),
('b2222222-2222-2222-2222-222222222222', 'Memory Management'),
('c3333333-3333-3333-3333-333333333333', 'Deadlock'),
('d4444444-4444-4444-4444-444444444444', 'Scheduling'),
('e5555555-5555-5555-5555-555555555555', 'Paging'),
('f6666666-6666-6666-6666-666666666666', 'Virtual Memory'),
('07777777-7777-7777-7777-777777777777', 'File System'),
('18888888-8888-8888-8888-188888888888', 'Disk Scheduling'),
('29999999-9999-9999-9999-299999999999', 'Linux Commands'),
('3aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Synchronization')
on conflict (name) do nothing;

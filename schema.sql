-- Create tables
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Create Policy: Users can only see their own bookmarks
create policy "Users can view own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

-- Create Policy: Users can insert their own bookmarks
create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

-- Create Policy: Users can delete their own bookmarks
create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- Create Indexes for performance
create index bookmarks_user_id_idx on bookmarks (user_id);
create index bookmarks_created_at_idx on bookmarks (created_at);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;

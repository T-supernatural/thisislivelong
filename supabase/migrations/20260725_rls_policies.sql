-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 1. SHOWCASE TABLE
-- ------------------------------------------

-- Policy: Allow public read access to all showcase items
CREATE POLICY "Allow public select on showcase"
ON showcase FOR SELECT
USING (true);

-- Policy: Allow admin-only full access to showcase items
-- Restricted to the authenticated user with email 'tinuademichael@gmail.com'
CREATE POLICY "Allow admin to manage showcase"
ON showcase FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com');

-- ------------------------------------------
-- 2. JOURNAL TABLE
-- ------------------------------------------

-- Policy: Allow public read access to all journal entries
CREATE POLICY "Allow public select on journal"
ON journal FOR SELECT
USING (true);

-- Policy: Allow admin-only full access to journal entries
-- Restricted to the authenticated user with email 'tinuademichael@gmail.com'
CREATE POLICY "Allow admin to manage journal"
ON journal FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com');

-- ------------------------------------------
-- 3. MESSAGES TABLE
-- ------------------------------------------

-- Policy: Allow public visitors to submit messages (INSERT only)
CREATE POLICY "Allow public insert on messages"
ON messages FOR INSERT
WITH CHECK (true);

-- Policy: Allow admin-only access to view and delete messages
-- Restricted to the authenticated user with email 'tinuademichael@gmail.com'
CREATE POLICY "Allow admin to manage messages"
ON messages FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com');

-- ------------------------------------------
-- 4. STORAGE POLICIES (showcase-images bucket)
-- ------------------------------------------

-- Policy: Allow public read access to showcase images
CREATE POLICY "Allow public read access to showcase-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'showcase-images');

-- Policy: Allow admin-only full CRUD access to showcase images
CREATE POLICY "Allow admin to manage showcase-images"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'showcase-images' AND 
  (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com')
)
WITH CHECK (
  bucket_id = 'showcase-images' AND 
  (auth.jwt() ->> 'email' = 'tinuademichael@gmail.com')
);

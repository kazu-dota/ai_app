-- Database initialization script for Docker container
-- This file is automatically executed when PostgreSQL container starts

-- Create the main database (if not exists)
-- Note: In Docker, the database is usually created by environment variables
-- This is a fallback script

-- Set timezone
SET timezone = 'Asia/Tokyo';

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for trigram matching (search)
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- for accent-insensitive search

-- Set default search configuration
-- SET default_text_search_config = 'pg_catalog.english';

-- Log initialization
DO $$ 
BEGIN 
    RAISE NOTICE 'Database initialized successfully at %', NOW();
END 
$$;
-- ====================================================================
-- TEM-AI Database Schema (PostgreSQL + Supabase + pgvector)
-- Grounded in C. Barry Carter's TEM Textbook
-- ====================================================================

-- 1. Enable pgvector extension for semantic RAG retrieval
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Books / References
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL,
    edition TEXT,
    publisher TEXT,
    year INTEGER,
    total_pages INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Chapters
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    part_number INTEGER,
    part_title TEXT,
    page_start INTEGER,
    page_end INTEGER,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sections
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    section_number TEXT NOT NULL,
    title TEXT NOT NULL,
    page_start INTEGER,
    page_end INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Document Chunks for pgvector RAG
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    chunk_index INTEGER NOT NULL,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    keywords TEXT[],
    figure_references TEXT[],
    formulas TEXT[],
    embedding VECTOR(768), -- Dimensions for Gemini text-embedding-004
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast cosine similarity vector search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 6. Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT DEFAULT 'TEM Conversation',
    mode TEXT CHECK (mode IN ('ASK', 'TUTOR', 'EXAM', 'EXPERIMENT')) DEFAULT 'ASK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    from_carter_content TEXT,
    additional_content TEXT,
    citations JSONB DEFAULT '[]'::jsonb,
    suggested_followups TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Exam Questions & Attempts
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    type TEXT CHECK (type IN ('MCQ', '2 MARK', '5 MARK', '10 MARK', 'VIVA')) NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
    marks INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_option_index INTEGER,
    model_answer TEXT NOT NULL,
    grading_criteria JSONB NOT NULL,
    carter_citation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    question_id UUID REFERENCES exam_questions(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    score_awarded NUMERIC(4,2),
    max_marks INTEGER NOT NULL,
    feedback JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Image Analysis Log
CREATE TABLE IF NOT EXISTS image_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    image_url TEXT,
    micrograph_type TEXT,
    scale_bar_nm NUMERIC(10,3),
    particle_count INTEGER,
    mean_diameter_nm NUMERIC(10,3),
    std_dev_nm NUMERIC(10,3),
    ai_vision_report JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Student Learning Progress
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    concepts_mastered TEXT[],
    questions_answered INTEGER DEFAULT 0,
    exam_average_score NUMERIC(5,2) DEFAULT 0,
    simulations_completed INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

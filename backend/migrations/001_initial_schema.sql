-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE resumes (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  cloudinary_url text NOT NULL,
  parsed_text text NOT NULL,
  filename text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create job_targets table
CREATE TABLE job_targets (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  company text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create analyses table
CREATE TABLE analyses (
  id uuid PRIMARY KEY,
  resume_id uuid NOT NULL REFERENCES resumes(id),
  job_target_id uuid NOT NULL REFERENCES job_targets(id),
  match_score integer,
  ats_score integer,
  matching_skills jsonb DEFAULT '[]'::jsonb,
  missing_skills jsonb DEFAULT '[]'::jsonb,
  improved_bullets jsonb DEFAULT '[]'::jsonb,
  ats_issues jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create interview_sessions table
CREATE TABLE interview_sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  job_target_id uuid NOT NULL REFERENCES job_targets(id),
  chat_history jsonb DEFAULT '[]'::jsonb,
  avg_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create skill_gaps table
CREATE TABLE skill_gaps (
  id uuid PRIMARY KEY,
  analysis_id uuid NOT NULL REFERENCES analyses(id),
  current_skills jsonb DEFAULT '[]'::jsonb,
  required_skills jsonb DEFAULT '[]'::jsonb,
  gap_skills jsonb DEFAULT '[]'::jsonb,
  priority_order jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create study_plans table
CREATE TABLE study_plans (
  id uuid PRIMARY KEY,
  skill_gap_id uuid NOT NULL REFERENCES skill_gaps(id),
  plan jsonb DEFAULT '[]'::jsonb,
  duration_weeks integer DEFAULT 4,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_job_targets_user_id ON job_targets(user_id);
CREATE INDEX idx_analyses_resume_id ON analyses(resume_id);
CREATE INDEX idx_analyses_job_target_id ON analyses(job_target_id);
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_skill_gaps_analysis_id ON skill_gaps(analysis_id);
CREATE INDEX idx_study_plans_skill_gap_id ON study_plans(skill_gap_id);

/*
  # Fitness Lead Generation App Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `age` (integer)
      - `weight` (decimal)
      - `height` (decimal)
      - `injuries` (text)
      - `fitness_level` (text)
      - `fitness_goal` (text)
      - `workout_days` (integer)
      - `dietary_restrictions` (text)
      - `phone_number` (text)
      - `whatsapp_sent` (boolean)
      - `created_at` (timestamp)
      - `conversation_log` (jsonb)

    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `message_type` (text)
      - `content` (text)
      - `timestamp` (timestamp)

    - `diet_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `plan_content` (text)
      - `generated_at` (timestamp)
      - `sent_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Users table for storing lead information
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  age integer,
  weight decimal(5,2),
  height decimal(5,2),
  injuries text,
  fitness_level text CHECK (fitness_level IN ('Beginner', 'Intermediate', 'Advanced')),
  fitness_goal text CHECK (fitness_goal IN ('Weight Loss', 'Muscle Gain', 'Maintenance', 'Strength')),
  workout_days integer CHECK (workout_days >= 1 AND workout_days <= 7),
  dietary_restrictions text,
  phone_number text,
  whatsapp_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  conversation_log jsonb DEFAULT '[]'::jsonb
);

-- Conversations table for storing chat messages
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message_type text CHECK (message_type IN ('user', 'bot')),
  content text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Diet plans table for storing generated plans
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_content text NOT NULL,
  generated_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow public insert on users"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read on users"
  ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to users"
  ON users
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for conversations table
CREATE POLICY "Allow public insert on conversations"
  ON conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read on conversations"
  ON conversations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to conversations"
  ON conversations
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for diet_plans table
CREATE POLICY "Allow public insert on diet_plans"
  ON diet_plans
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read on diet_plans"
  ON diet_plans
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to diet_plans"
  ON diet_plans
  FOR ALL
  TO authenticated
  USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user_id ON diet_plans(user_id);
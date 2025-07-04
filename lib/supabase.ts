import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  injuries?: string;
  fitness_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  fitness_goal?: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Strength';
  workout_days?: number;
  dietary_restrictions?: string;
  phone_number?: string;
  whatsapp_sent?: boolean;
  created_at?: string;
  conversation_log?: any[];
};

export type Conversation = {
  id: string;
  user_id: string;
  message_type: 'user' | 'bot';
  content: string;
  timestamp: string;
};

export type DietPlan = {
  id: string;
  user_id: string;
  plan_content: string;
  generated_at: string;
  sent_at?: string;
};
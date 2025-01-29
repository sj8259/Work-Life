/*
  # Fix Profile RLS Policies

  1. Changes
    - Add INSERT policy for profiles table to allow new user registration
    - Ensure authenticated users can create their own profile

  2. Security
    - Only allow users to create their own profile
    - Maintain existing RLS policies
*/

-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
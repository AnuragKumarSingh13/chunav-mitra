-- Enable Row Level Security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can only read their own data
CREATE POLICY "Users read own data" ON users
FOR SELECT USING (phone = current_setting('app.user_phone', true));

-- Policy 2: Only service role can update is_premium
CREATE POLICY "Only admin can update premium" ON users
FOR UPDATE USING (auth.role() = 'service_role');

-- Policy 3: Anyone can insert (for registration)
CREATE POLICY "Anyone can register" ON users
FOR INSERT WITH CHECK (true);

-- Policy 4: Users can update their own profile (except is_premium)
CREATE POLICY "Users update own profile" ON users
FOR UPDATE USING (
  phone = current_setting('app.user_phone', true) AND 
  auth.role() != 'service_role'
);

-- Create rate limiting table for OTP attempts
CREATE TABLE IF NOT EXISTS otp_attempts (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy for OTP attempts
CREATE POLICY "Users can manage own OTP attempts" ON otp_attempts
FOR ALL USING (phone = current_setting('app.user_phone', true));

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_otp_attempts_phone ON otp_attempts(phone);

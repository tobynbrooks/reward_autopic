const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3001'
      }
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('✓ User created successfully!');
    console.log('Email:', email);
    console.log('User ID:', data.user?.id);
    console.log('\nNote: Check email for confirmation link (or disable email confirmation in Supabase Auth settings)');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Usage: node create-user.js
const email = process.argv[2] || 'test@example.com';
const password = process.argv[3] || 'TestPassword123!';

createUser(email, password);

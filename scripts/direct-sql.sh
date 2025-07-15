#!/bin/bash
# Direct SQL execution via Supabase

echo "🔧 Attempting direct table creation..."

# First, try to create a minimal users table
CREATE_USERS_SQL='CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, business_category VARCHAR(50), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());'

# Try via PostgREST function
curl -s -X POST \
  "https://mjydrjmckcoixrnnrehm.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$CREATE_USERS_SQL\"}"

echo ""
echo "Testing table creation result..."

# Test if table exists now
curl -s -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "https://mjydrjmckcoixrnnrehm.supabase.co/rest/v1/users?select=count"
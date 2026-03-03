# Supabase Setup Guide

This guide explains how to set up Supabase for your Charcoal Station Business Manager.

---

## Step 1: Create a Supabase Project

1. Go to **https://supabase.com/**
2. Click **"Start your project"**
3. Sign in or create an account
4. Click **"New Project"**
5. Fill in:
   - **Name**: `charcoal-station`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait 1-2 minutes for setup

---

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

---

## Step 3: Set Up Database Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase/migration.sql` from this project
4. Paste into the editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is normal!

---

## Step 4: Configure Environment Variables

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon public key |

### For Local Development:

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 5: Deploy & Test

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Test the app:
   - Add a product
   - Record a sale
   - Check Supabase dashboard → **Table Editor** to see data

---

## Database Schema

The migration creates these tables:

```
┌─────────────────────────────────────────────────────────┐
│                     PRODUCTS                            │
├─────────────────────────────────────────────────────────┤
│ id (PRD-00001) | name | price | created_at | is_active │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               PRODUCT_PRICE_HISTORY                     │
├─────────────────────────────────────────────────────────┤
│ id | product_id | old_price | new_price | changed_at   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   EXPENSE_TYPES                         │
├─────────────────────────────────────────────────────────┤
│ id (EXT-00001) | name | created_at | is_active         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       SALES                             │
├─────────────────────────────────────────────────────────┤
│ id (SAL-00001) | product_id | product_name | quantity  │
│ unit_price | total_amount | date | time | datetime     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     EXPENSES                            │
├─────────────────────────────────────────────────────────┤
│ id (EXP-00001) | expense_type_id | expense_type_name   │
│ amount | description | date | created_at               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     PARTNERS                            │
├─────────────────────────────────────────────────────────┤
│ id (PTR-00001) | name | percentage | created_at        │
│ is_active                                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   PROFIT_SPLITS                         │
├─────────────────────────────────────────────────────────┤
│ id (PFS-00001) | month | year | total_income           │
│ total_expenses | net_profit | split_date | created_at  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PARTNER_SPLITS                        │
├─────────────────────────────────────────────────────────┤
│ id | profit_split_id | partner_id | partner_name       │
│ percentage | amount | created_at                        │
└─────────────────────────────────────────────────────────┘
```

---

## Migrating Existing Data

If you have existing data in CSV files, you can import it to Supabase:

### Import via Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. For each table:
   - Click table name
   - Click **"Insert"** → **"Import data from CSV"**
   - Upload your CSV file
   - Map columns if needed

---

## Security Notes

### Row Level Security (RLS)

The migration enables RLS on all tables with public policies for the anon key. This is suitable for:

- Personal use
- Small team with shared credentials
- Development/testing

### For Production with User Authentication

1. Set up Supabase Auth (Email, Google, etc.)
2. Update RLS policies to check user identity:

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can read own data" ON products
  FOR SELECT USING (auth.uid() = user_id);
```

3. Add a `user_id` column to tables
4. Update the app to handle authentication

---

## Troubleshooting

### "Failed to fetch products"

1. Check Supabase credentials are correct
2. Verify RLS policies are set
3. Check browser console for errors

### "Permission denied"

1. Go to Supabase → Authentication → Policies
2. Ensure policies exist for all tables
3. Run the migration SQL again

### "Connection refused"

1. Check your internet connection
2. Verify Supabase project is not paused (free tier pauses after 7 days of inactivity)
3. Check if the Supabase URL is correct

---

## File Structure

```
src/lib/
├── supabase.ts        # Supabase client configuration
├── data-supabase.ts   # Supabase data operations
├── data.ts            # Main data layer exports
├── date-utils.ts      # Sri Lankan time utilities
└── utils.ts           # General utilities

supabase/
└── migration.sql      # Database schema for Supabase
```

---

## Quick Reference

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Useful Commands

```bash
# Run linting
bun run lint

# Build for production
bun run build

# Deploy to Vercel
vercel --prod
```

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

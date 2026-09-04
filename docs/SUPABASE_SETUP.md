# Connecting NERALIS with Supabase 🚀

NERALIS is fully engineered to connect seamlessly to **Supabase PostgreSQL** as its primary cloud database and intelligence store.

---

## 📋 Quick Setup (3 Easy Steps)

### Step 1: Obtain your Supabase Database URL
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (or create a new free project).
3. Navigate to **Project Settings** (gear icon) ➡️ **Database**.
4. Under **Connection string**, select **URI** or **Connection Pooler**:
   - **Connection Pooler (Session / Transaction)** (Recommended):
     ```
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - **Direct Connection**:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```

---

### Step 2: Configure Environment Variables

Open `backend/.env` and paste your Supabase connection string into `DATABASE_URL`:

```env
# backend/.env
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# (Optional) Supabase API credentials if using Supabase Auth or Storage
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

### Step 3: Initialize and Seed Tables

Run the automated seeding engine to create all 13 domain tables and populate all NER geospatial datasets (8 States, 45+ Districts, Corridors, Bridges, Depots, Telemetry, and Governance Accounts):

```bash
# In the backend directory:
python -m app.db.seed
```

You will see confirmation logs indicating all tables and master records have been created and verified in Supabase!

---

## 🗄️ Alternative: Run SQL Directly in Supabase SQL Editor

If you prefer to run raw SQL schema scripts in the browser:
1. Open your Supabase Dashboard ➡️ **SQL Editor**.
2. Open the file `backend/supabase_schema.sql`.
3. Paste the contents into the SQL Editor and click **Run**.

---

## 🔍 Verification

Start the NERALIS backend:
```bash
python run.py
```
Open `http://127.0.0.1:8000/api/health` to verify all services are active and connected.

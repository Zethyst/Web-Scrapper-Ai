# 🚨 Quick Fix: Task Loading Error

## The Problem
Port 5000 is blocked by macOS AirPlay Receiver, so your backend server can't start.

## Solution (Choose One)

### Option 1: Change Backend Port (Easiest)

1. **Create/update `backend/.env`:**
   ```env
   PORT=5001
   DATABASE_URL=your_database_url_here
   REDIS_URL=your_redis_url_here
   OPENAI_API_KEY=your_openai_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

2. **Update frontend `.env.local` (in root directory):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

3. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Restart frontend:**
   ```bash
   npm run dev
   ```

### Option 2: Disable AirPlay Receiver

1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **General** > **AirDrop & Handoff**
3. Turn off **AirPlay Receiver**
4. Restart your backend:
   ```bash
   cd backend
   npm run dev
   ```

### Option 3: Kill AirPlay Process

```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Then start backend
cd backend
npm run dev
```

## Verify It's Working

After applying the fix, test the connection:

```bash
npm run test:backend
```

You should see:
```
✅ Success! Received X tasks
```

If you still see errors, check:
1. Backend terminal for error messages
2. Browser console (F12) for detailed errors
3. Run `npm run test:backend` for diagnostics

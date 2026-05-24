# 🔍 Task Loading Error Diagnostics

## Problem Identified

The frontend is trying to fetch tasks from `http://localhost:5000/api/tasks`, but:
- **Port 5000 is occupied by macOS AirPlay Receiver** (ControlCenter)
- **Backend server is not running**

## Quick Fix

### Option 1: Start the Backend Server (Recommended)

1. Open a new terminal window
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

   This will:
   - Compile TypeScript
   - Start the Express server
   - Start the BullMQ worker
   - Run on port 5000 (or PORT from .env)

### Option 2: Change Backend Port

If port 5000 is blocked, you can change it:

1. Create/update `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update `app/.env.local` (or root `.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

3. Restart both frontend and backend

## Verification Steps

### 1. Check if backend is running:
```bash
curl http://localhost:5000/api/tasks
# Should return JSON array (even if empty [])
```

### 2. Test backend connection:
```bash
npm run test:backend
```

### 3. Check browser console:
- Open DevTools (F12)
- Check Network tab for failed requests
- Check Console for error messages

## Common Issues

### Issue: "Cannot connect to backend API"
- **Solution**: Backend server is not running. Start it with `cd backend && npm run dev`

### Issue: "CORS error"
- **Solution**: Make sure `http://localhost:3000` is in the CORS origins list in `backend/src/api/index.ts`

### Issue: "Table 'tasks' does not exist"
- **Solution**: Run `npm run db:migrate` to create the database tables

### Issue: "403 Forbidden" from AirPlay
- **Solution**: Port 5000 is blocked. Use Option 2 above to change ports

## Debugging Commands

```bash
# Test backend connection
npm run test:backend

# Check what's using port 5000
lsof -i :5000

# Run database migration
npm run db:migrate

# Check backend logs
# (Look at the terminal where backend is running)
```

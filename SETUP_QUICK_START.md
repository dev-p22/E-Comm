# ⚡ Quick Setup Checklist

Complete these steps to activate the security upgrades:

---

## ✅ Step 1: Generate JWT Secret (REQUIRED)

```bash
# Run this command:
openssl rand -base64 32

# Copy the output (looks like: "a1b2c3d4e5f6... ==")
```

---

## ✅ Step 2: Add to .env.local

```bash
# Open .env.local in your editor and add:

JWT_SECRET=<paste-the-generated-secret-here>

# Example:
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6==
```

---

## ✅ Step 3: Verify Dependencies

```bash
# Check if jose is installed:
npm ls jose

# If missing, run:
npm install

# Should show: jose@5.4.0
```

---

## ✅ Step 4: Start Development Server

```bash
npm run dev

# Should output:
# ▲ Next.js 16.2.3
# - Local:        http://localhost:3000
# - Environments: .env.local

# ✓ Ready in 2.5s
```

---

## ✅ Step 5: Test Authentication Flow

### Test Login:
1. Open http://localhost:3000/login
2. Use test credentials or register new account
3. Should redirect to homepage after login

### Verify Security:
1. Open DevTools (F12)
2. Go to **Application** → **Cookies**
3. Should see `authToken` with "HttpOnly" flag ✅
4. **localStorage should be EMPTY** ✅
5. Logout should delete the cookie ✅

---

## ✅ Step 6: Verify Middleware Protection

### Test Protected Routes:
```bash
# Open in new incognito window (no cookies)
http://localhost:3000/checkout

# Should redirect to /login (middleware protecting route)
```

---

## ✅ Step 7: Check Security Headers

```bash
# In terminal, run:
curl -I http://localhost:3000

# Should show security headers like:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

---

## 📋 Configuration Files Created/Modified

### New Files:
- ✅ `middleware.ts` - Route protection
- ✅ `lib/api-utils.ts` - Helper functions
- ✅ `SECURITY.md` - Full documentation
- ✅ `SECURITY_UPGRADE_SUMMARY.md` - This summary
- ✅ `API_MIGRATION_GUIDE.md` - Update API routes
- ✅ `.env.local.example` - Environment template

### Modified Files:
- ✅ `app/api/(auth)/login/route.ts` - JWT + HTTP-only
- ✅ `app/api/(auth)/register/route.ts` - JWT + HTTP-only
- ✅ `app/api/(auth)/logout/route.ts` - Clear cookie
- ✅ `redux/authSlice.ts` - Remove localStorage
- ✅ `component/providers/AuthLoader.tsx` - Simplify
- ✅ `component/auth/LoginForm.tsx` - Use API endpoint
- ✅ `lib/utils.ts` - Add security utilities
- ✅ `next.config.ts` - Add security headers
- ✅ `package.json` - Add jose dependency

---

## 🚨 Critical: Must Do NOW

```bash
# 1. Generate secret:
openssl rand -base64 32

# 2. Add to .env.local:
JWT_SECRET=<generated-secret>

# 3. Install dependencies:
npm install

# 4. Restart dev server:
npm run dev
```

**⚠️ Without these steps, authentication will fail!**

---

## 🔍 Troubleshooting

### Issue: "jose not found"
```bash
npm install
```

### Issue: "JWT_SECRET is undefined"
```bash
# Check .env.local exists and contains:
JWT_SECRET=<your-secret>
# Restart server after updating
```

### Issue: "authToken not appearing in cookies"
- Clear browser cookies
- Clear browser cache
- Try login again
- Check DevTools Network tab

### Issue: "Routes not redirecting to login"
```bash
# Check middleware.ts is at project root
# (same level as app/ folder)
# Restart dev server
```

---

## 📚 Documentation

Read these for more details:

1. **`SECURITY.md`** - Complete security guide
2. **`API_MIGRATION_GUIDE.md`** - How to update API routes
3. **`.env.local.example`** - Environment variables

---

## ✨ What's Secured Now

✅ **Authentication** - JWT tokens in HTTP-only cookies  
✅ **Routes** - Middleware protection  
✅ **CSRF** - SameSite cookies  
✅ **Headers** - CSP, X-Frame-Options, etc.  
✅ **Data** - No localStorage, minimal Redux  
✅ **Passwords** - Strength validation  
✅ **Errors** - Sanitized messages  

---

## 🚀 Ready to Deploy

After completing the above steps, your app is ready for:
- Development testing
- Staging deployment
- Production release (with HTTPS enabled)

---

**Time to complete**: ~5 minutes ⏱️  
**Questions?** Check `SECURITY.md` or `API_MIGRATION_GUIDE.md`


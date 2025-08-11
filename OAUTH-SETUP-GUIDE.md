# 🚀 **OAUTH SETUP GUIDE - GOOGLE & GITHUB AUTHENTICATION**

## 🎯 **COMPLETE SETUP INSTRUCTIONS FOR SUPABASE OAUTH**

---

## 📋 **STEP 1: SUPABASE AUTHENTICATION SETUP**

### **1.1 Enable Authentication Providers**
1. Go to your Supabase Dashboard: https://aynkghrgocuykhpxdigt.supabase.co
2. Navigate to **Authentication** → **Providers**
3. You'll see a list of providers (Google, GitHub, etc.)

---

## 🔵 **STEP 2: GOOGLE OAUTH SETUP**

### **2.1 Create Google OAuth App**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**

### **2.2 Configure OAuth Consent Screen**
1. Go to **OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: `Trica - Mind Destruction Platform`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### **2.3 Create OAuth 2.0 Client ID**
1. Go back to **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Name it: `Trica Website`
5. **Authorized redirect URIs**: Add these URLs:
   ```
   https://aynkghrgocuykhpxdigt.supabase.co/auth/v1/callback
   http://localhost:3010/auth/callback
   ```
6. Click **Create**
7. **COPY** the `Client ID` and `Client Secret`

### **2.4 Configure in Supabase**
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click **Configure**
3. Enable Google provider
4. Paste your `Client ID` and `Client Secret`
5. Click **Save**

---

## ⚫ **STEP 3: GITHUB OAUTH SETUP**

### **3.1 Create GitHub OAuth App**
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the form:
   - **Application name**: `Trica - Mind Destruction Platform`
   - **Homepage URL**: `http://localhost:3010` (or your domain)
   - **Authorization callback URL**: `https://aynkghrgocuykhpxdigt.supabase.co/auth/v1/callback`
4. Click **Register application**
5. **COPY** the `Client ID`
6. Click **Generate a new client secret** and **COPY** it

### **3.2 Configure in Supabase**
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **GitHub** and click **Configure**
3. Enable GitHub provider
4. Paste your `Client ID` and `Client Secret`
5. Click **Save**

---

## 🌐 **STEP 4: CONFIGURE REDIRECT URLs**

### **4.1 Update Site URL in Supabase**
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3010` (for development)
3. Add **Redirect URLs**:
   ```
   http://localhost:3010
   http://localhost:3010/auth/callback
   https://yourdomain.com (for production)
   https://yourdomain.com/auth/callback
   ```

---

## 🔧 **STEP 5: UPDATE YOUR CODE (ALREADY DONE!)**

The code is already set up! Here's what's configured:

### **Environment Variables** (`.env.local`):
```env
VITE_SUPABASE_URL=https://aynkghrgocuykhpxdigt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Auth Functions** (`AuthContext.jsx`):
```javascript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};

const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};
```

---

## 🧪 **STEP 6: TEST THE AUTHENTICATION**

### **6.1 Test Google OAuth**
1. Visit: http://localhost:3010/
2. Click **Sign In** button in header
3. Click **Continue with Google**
4. Should redirect to Google login
5. After login, redirects back to your site

### **6.2 Test GitHub OAuth**
1. Click **Continue with GitHub**
2. Should redirect to GitHub login
3. After login, redirects back to your site

---

## 🚨 **TROUBLESHOOTING COMMON ISSUES**

### **Issue 1: "Redirect URI Mismatch"**
**Solution**: Make sure redirect URIs match exactly:
- Google: `https://aynkghrgocuykhpxdigt.supabase.co/auth/v1/callback`
- GitHub: `https://aynkghrgocuykhpxdigt.supabase.co/auth/v1/callback`

### **Issue 2: "Invalid Client"**
**Solution**: Double-check Client ID and Client Secret are correct

### **Issue 3: "Access Blocked"**
**Solution**: For Google, make sure OAuth consent screen is configured

### **Issue 4: "CORS Error"**
**Solution**: Add your domain to Supabase URL Configuration

---

## 🎯 **STEP 7: PRODUCTION DEPLOYMENT**

### **7.1 Update OAuth Apps for Production**
1. **Google**: Add production domain to authorized redirect URIs
2. **GitHub**: Update homepage URL and callback URL
3. **Supabase**: Update Site URL and Redirect URLs

### **7.2 Production URLs**
```
Site URL: https://yourdomain.com
Redirect URLs:
- https://yourdomain.com
- https://yourdomain.com/auth/callback
```

---

## 🔥 **WHAT YOU GET AFTER SETUP:**

### **✅ Google OAuth Features:**
- User profile with name and avatar
- Email verification
- Google account integration
- Verified badge for Google users

### **✅ GitHub OAuth Features:**
- Developer profile integration
- GitHub username and avatar
- Repository access (if needed)
- Verified badge for GitHub users

### **✅ Premium Features Unlocked:**
- **Verified Badge** for OAuth users
- **Priority REPL Access**
- **Advanced Mind Destruction**
- **Exclusive Dance Moves**
- **Secret Code Examples**
- **Beta Features Access**

---

## 📊 **QUICK SETUP CHECKLIST**

- [ ] Create Google OAuth App
- [ ] Configure Google OAuth consent screen
- [ ] Get Google Client ID and Secret
- [ ] Create GitHub OAuth App
- [ ] Get GitHub Client ID and Secret
- [ ] Enable providers in Supabase
- [ ] Configure redirect URLs
- [ ] Test Google login
- [ ] Test GitHub login
- [ ] Verify user profile works
- [ ] Check premium features

---

## 🚀 **FINAL RESULT**

After setup, users can:
1. **Sign in with Google/GitHub** - One-click authentication
2. **Get verified badges** - Automatic verification for OAuth users
3. **Access premium features** - Exclusive content and functionality
4. **Persistent sessions** - Stay logged in across visits
5. **Real-time reviews** - Submit reviews with verified accounts
6. **User profiles** - View stats and achievements

**🎯 STATUS: READY FOR MIND DESTRUCTION WITH OAUTH! 🧠💥**

Visit http://localhost:3010/ after setup and click "Sign In" to test! 🚀
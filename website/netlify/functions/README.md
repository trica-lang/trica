# 🔥 TRICA NETLIFY SERVERLESS FUNCTIONS 🔥

Serverless API endpoints for the mind-bending Trica programming language, deployed on Netlify Functions with Supabase integration.

## 🚀 Functions

### 📡 API Status
- **File**: `api-status.js`
- **Endpoint**: `/.netlify/functions/api-status`
- **Method**: GET
- **Description**: Health check and API information

### 📦 Package Management
- **File**: `api-packages.js`
- **Endpoint**: `/.netlify/functions/api-packages`
- **Methods**: GET (list), POST (publish)
- **Description**: TPKG package registry operations

### 📦 Package Installation
- **File**: `api-package-install.js`
- **Endpoint**: `/.netlify/functions/api-package-install`
- **Method**: POST
- **Description**: Increment download counts for packages

### ⭐ Reviews System
- **File**: `api-reviews.js`
- **Endpoint**: `/.netlify/functions/api-reviews`
- **Methods**: GET (list), POST (submit)
- **Description**: User reviews and ratings

### 🔥 Code Execution
- **File**: `api-execute.js`
- **Endpoint**: `/.netlify/functions/api-execute`
- **Method**: POST
- **Description**: Simulate Trica code execution

### 📊 Statistics
- **File**: `api-stats.js`
- **Endpoint**: `/.netlify/functions/api-stats`
- **Method**: GET
- **Description**: Platform statistics and metrics

## 🛠️ Setup

1. **Install Dependencies**:
   ```bash
   cd netlify/functions
   npm install
   ```

2. **Environment Variables** (set in Netlify dashboard):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Deploy**: Push to your connected Git repository

## 🌐 URL Redirects

The `netlify.toml` file includes redirects for cleaner URLs:

- `/api/status` → `/.netlify/functions/api-status`
- `/api/packages` → `/.netlify/functions/api-packages`
- `/api/reviews` → `/.netlify/functions/api-reviews`
- etc.

## 🔒 Security Features

- **CORS**: Enabled for all origins
- **Rate Limiting**: Handled by Netlify
- **Input Validation**: All endpoints validate input
- **Error Handling**: Consistent error responses

## 📊 Response Format

All functions return JSON in this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

## 🧠 Mind Destruction Levels

Package quantum levels:
- **1-3**: Safe for beginners
- **4-6**: Moderate mind bending  
- **7-9**: Dangerous consciousness alteration
- **10**: Reality-threatening
- **11**: Complete mind destruction

## 🚀 Deployment

Functions are automatically deployed when you push to your connected Git repository. Netlify will:

1. Install dependencies from `package.json`
2. Build and deploy functions
3. Set up URL redirects from `netlify.toml`
4. Apply environment variables

---

**🔥 TRICA SERVERLESS FUNCTIONS - REALITY MEETS THE CLOUD 🔥**
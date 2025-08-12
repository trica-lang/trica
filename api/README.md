# 🔥 TRICA API SERVER 🔥

RESTful API for the mind-bending Trica programming language with TPKG Package Manager integration.

## 🚀 Features

- **Package Management**: TPKG package registry with Supabase
- **Code Execution**: Simulate Trica bytecode execution
- **Review System**: User reviews and ratings with likes
- **Real-time Updates**: Live data synchronization
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Cross-origin requests enabled

## 📡 API Endpoints

### 🔥 General

- `GET /api/status` - API health check and version info

### 📦 Package Management

- `GET /api/packages` - List all TPKG packages
- `GET /api/packages/:name` - Get specific package details
- `POST /api/packages` - Publish new package
- `POST /api/packages/:name/install` - Increment download count

### ⭐ Reviews

- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Submit new review

### 🔥 Code Execution

- `POST /api/execute` - Execute Trica code (simulation)

### 📊 Statistics

- `GET /api/stats` - Get platform statistics

## 🛠️ Installation

```bash
cd api
npm install
```

## 🚀 Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3001 by default.

## 🌐 Environment Variables

Create a `.env` file:

```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 📦 Package Publishing

```bash
curl -X POST http://localhost:3001/api/packages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my_package",
    "version": "1.0.0",
    "description": "My awesome Trica package",
    "author": "Your Name",
    "quantum_level": 5,
    "code": "Main { Print \"Hello, Trica!\" }"
  }'
```

## ⭐ Review Submission

```bash
curl -X POST http://localhost:3001/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "rating": 5,
    "title": "Mind Destroyed!",
    "comment": "This language literally broke my understanding of programming.",
    "mind_destroyed": true
  }'
```

## 🔥 Code Execution

```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "Main { Print \"Hello, World!\" }"
  }'
```

## 📊 Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## 🔒 Rate Limiting

- 100 requests per 15 minutes per IP
- Applies to all `/api/*` endpoints

## 🧠 Mind Destruction Levels

Quantum levels for packages:

- **1-3**: Safe for beginners
- **4-6**: Moderate mind bending
- **7-9**: Dangerous consciousness alteration
- **10**: Reality-threatening
- **11**: Complete mind destruction (use with extreme caution)

## 🚀 Deployment

The API can be deployed to any Node.js hosting platform:

- Heroku
- Vercel
- Railway
- DigitalOcean App Platform
- AWS Lambda

## 📝 License

MIT License - See LICENSE file for details.

---

**🔥 TRICA API - WHERE REALITY MEETS CODE 🔥**
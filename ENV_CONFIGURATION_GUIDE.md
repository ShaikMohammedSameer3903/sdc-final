# Environment Configuration Guide

This guide explains how to configure the ApnaRide application for different environments (development, production) using environment files.

## Quick Start

### Development Setup

1. **Backend Setup:**
   ```bash
   cd "Back End"
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

2. **Frontend Setup:**
   ```bash
   cd apnaride-frontend
   cp .env.example .env
   # Default values work for local development
   ```

### Production Deployment

1. **Backend Configuration:**
   ```bash
   cd "Back End"
   cp .env.production .env
   # Edit .env with your production values
   ```

2. **Frontend Configuration:**
   ```bash
   cd apnaride-frontend
   cp .env.production .env
   # Edit .env with your production backend URL
   ```

---

## Backend Environment Variables

### File Locations
- Development: `Back End/.env` (copy from `.env.example`)
- Production: `Back End/.env.production` (copy to `.env`)

### Required Variables

| Variable | Description | Development Default | Production Value |
|----------|-------------|---------------------|------------------|
| `SERVER_PORT` | Backend server port | `9031` | `9031` |
| `DB_HOST` | Database host | `localhost` | Your production DB host |
| `DB_PORT` | Database port | `3306` | `3306` |
| `DB_NAME` | Database name | `apnaride` | `apnaride` |
| `DB_USERNAME` | Database username | `root` | Your production DB user |
| `DB_PASSWORD` | Database password | `your_password` | Your production DB password |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173,http://localhost:3000` | Your frontend URL(s) |
| `FRONTEND_URL` | Frontend URL for redirects | `http://localhost:5173` | Your frontend URL |
| `WEBSOCKET_ALLOWED_ORIGINS` | WebSocket allowed origins | Same as CORS | Your frontend URL(s) |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRATION` | JWT token expiration (ms) |

---

## Frontend Environment Variables

### File Locations
- Development: `apnaride-frontend/.env` (copy from `.env.example`)
- Production: `apnaride-frontend/.env.production` (copy to `.env`)

### Required Variables

| Variable | Description | Development Default | Production Value |
|----------|-------------|---------------------|------------------|
| `VITE_API_BASE` | Backend API URL | `http://localhost:9031` | `http://YOUR-BACKEND-IP:9031` |
| `VITE_WS_BASE_URL` | WebSocket URL | `ws://localhost:9031` | `ws://YOUR-BACKEND-IP:9031` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `VITE_RAZORPAY_KEY` | Razorpay payment key |
| `VITE_MAP_DEFAULT_LAT` | Default map latitude |
| `VITE_MAP_DEFAULT_LNG` | Default map longitude |
| `VITE_ENABLE_DEBUG` | Enable debug mode |

---

## Deployment Examples

### Example 1: Deploy to EC2 with IP 44.220.151.172 (Frontend & Backend on same server)

**Backend `.env`:**
```env
SERVER_PORT=9031
DB_HOST=database-1.cc38e2ug2u3c.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=apnaride
DB_USERNAME=admin
DB_PASSWORD=12345678
CORS_ALLOWED_ORIGINS=http://44.220.151.172:5173,http://44.220.151.172,http://localhost:5173
FRONTEND_URL=http://44.220.151.172:5173
WEBSOCKET_ALLOWED_ORIGINS=http://44.220.151.172:5173,http://44.220.151.172,http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_BASE=http://44.220.151.172:9031/api
VITE_WS_BASE_URL=ws://44.220.151.172:9031
```

### Example 2: Deploy with Domain Names

**Backend `.env`:**
```env
SERVER_PORT=9031
DB_HOST=db.yourdomain.com
DB_PORT=3306
DB_NAME=apnaride
DB_USERNAME=apnaride_user
DB_PASSWORD=secure_password
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=https://yourdomain.com
WEBSOCKET_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Frontend `.env`:**
```env
VITE_API_BASE=https://api.yourdomain.com
VITE_WS_BASE_URL=wss://api.yourdomain.com
```

---

## Important Notes

1. **Never commit `.env` files to git** - They are already in `.gitignore`

2. **After changing `.env` files:**
   - Backend: Restart the Spring Boot application
   - Frontend: Rebuild the application (`npm run build`)

3. **CORS Configuration:**
   - Must include all frontend URLs that will access the backend
   - Use commas to separate multiple origins
   - No spaces between URLs

4. **Production Security:**
   - Use strong passwords for database
   - Use HTTPS in production
   - Set `JPA_SHOW_SQL=false` in production
   - Use secure `JWT_SECRET` (minimum 256 bits)

---

## Troubleshooting

### Frontend can't connect to backend
1. Check `VITE_API_BASE_URL` in frontend `.env`
2. Check `CORS_ALLOWED_ORIGINS` in backend `.env`
3. Ensure backend is running on the correct port

### WebSocket not connecting
1. Check `VITE_WS_BASE_URL` in frontend `.env`
2. Check `WEBSOCKET_ALLOWED_ORIGINS` in backend `.env`
3. Ensure WebSocket endpoint `/ws` is accessible

### Database connection failed
1. Check `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
2. Ensure MySQL is running and accessible
3. Check firewall settings

---

## File Structure

```
new/
├── Back End/
│   ├── .env.example          # Development template
│   ├── .env.production       # Production template
│   └── .env                  # Your actual config (gitignored)
│
└── apnaride-frontend/
    ├── .env.example          # Development template
    ├── .env.production       # Production template
    └── .env                  # Your actual config (gitignored)
```

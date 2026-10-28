# SocialSync – Smart Social Media Content Management Dashboard

A full-stack MERN application for creating, managing, scheduling, and analyzing social media posts across Facebook, Instagram, and WhatsApp from one dashboard.

## Structure

```
SocialSync
├── client   (React + Vite + Redux Toolkit + Reselect + Tailwind)
└── server   (Node + Express + MongoDB + JWT + Multer)
```

## Features

- JWT authentication (register / login / protected routes)
- Dashboard with stats, recent posts, quick actions
- Post creation with live preview, platform selection, hashtag suggestions
- Real-time character-limit validation per platform (client + server)
- Media upload (images & videos) via Multer
- Drafts, scheduled posts, and publishing workflow
- Monthly calendar view of drafts / scheduled / published posts
- Analytics dashboard (pie, bar, and line charts via Recharts)
- Search & filter by platform, status, keyword, and date range
- Performance: Redux Toolkit + Reselect memoized selectors, route-based
  lazy loading, `React.memo` on presentational components

## Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` and `/uploads`
requests to the backend automatically (see `client/vite.config.js`).

## Environment Variables (server/.env)

| Variable         | Description                        |
|------------------|-------------------------------------|
| `PORT`           | Server port (default 5000)          |
| `MONGO_URI`      | MongoDB Atlas connection string     |
| `JWT_SECRET`     | Secret used to sign JWTs            |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`           |
| `CLIENT_URL`     | Frontend origin, for CORS           |

## API Overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET/PUT /api/auth/profile`
- `GET/POST /api/posts`, `GET/PUT/DELETE /api/posts/:id`
- `GET /api/posts/drafts`, `GET /api/posts/scheduled`
- `POST /api/posts/:id/media` (multipart upload)
- `POST /api/posts/validate` (platform validation, no save)
- `GET /api/analytics`

## Notes

- This is a scaffold intended as a strong starting point: swap in a real
  Cloudinary/S3 integration for production media storage, add a cron job
  or worker to auto-publish posts once `scheduledDate` passes, and wire
  the actual Facebook/Instagram/WhatsApp Graph APIs when you're ready to
  publish for real rather than simulate the workflow.
- Deploy the client to Vercel and the server to Render/Railway as noted
  in the original spec.

# BC Connect

Business directory SPA for BC startups. MERN stack.

## Structure

- `frontend/` — React SPA
- `backend/` — Node/Express REST API

## Backend Setup

1. Go to `backend/`.
2. Install dependencies: `npm install`
3. Confirm `backend/.env` has values for:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
4. Start backend: `npm run dev`

### Auth Endpoints

- `POST /api/auth/register` with `{ username, email?, password }`
- `POST /api/auth/login` with `{ identifier, password }`

Both return a signed JWT where the payload includes `id` and `username`.

### Protected Routes

- `POST /api/businesses`
- `DELETE /api/businesses/:id`

These require `Authorization: Bearer <token>` and return `401` or `403` when invalid/missing.

## Frontend Setup

1. Go to `frontend/`
2. Install dependencies: `npm install`
3. Create `frontend/.env.local` with:
   - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Start frontend: `npm run dev`

<img width="667" height="547" alt="image" src="https://github.com/user-attachments/assets/123aedcd-da68-42e6-bbee-6e21e5c97a70" />

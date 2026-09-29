# Caleb CRM API

An Express and TypeScript REST API for managing CRM users, clients, projects, and payments. It uses Supabase for data storage and includes optional Gemini AI, Cloudinary uploads, and email integrations.

## Requirements

- Node.js and npm
- A Supabase project

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=replace-with-a-long-random-secret
   CORS_ORIGIN=http://localhost:3000
   ```

   `CORS_ORIGIN` can contain multiple comma-separated origins. If omitted, the API allows `http://localhost:3000` and `http://127.0.0.1:3000`.

3. Set up the database by running [`supabase-schema.sql`](supabase-schema.sql) in the Supabase SQL Editor.

4. Start the development server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:5000` by default. Check `http://localhost:5000/health` for a health response.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the TypeScript server with automatic restart |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled server |
| `node seed.js` | Add sample clients and projects to Supabase |

Run the seed script only after applying the database schema and configuring Supabase environment variables. It may add duplicate sample projects if run more than once.

## API Routes

All routes are under `/api`. Except for registration and login, endpoints require a JWT sent as `Authorization: Bearer <token>`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/api/clients` | Authenticated | List clients |
| `POST` | `/api/clients` | Authenticated | Create a client |
| `GET` | `/api/clients/:id` | Authenticated | Get a client |
| `PUT` | `/api/clients/:id` | Authenticated | Update a client |
| `DELETE` | `/api/clients/:id` | Authenticated | Delete a client |
| `GET` | `/api/projects` | Authenticated | List projects |
| `POST` | `/api/projects` | Authenticated | Create a project |
| `GET` | `/api/projects/:id` | Authenticated | Get a project |
| `PUT` | `/api/projects/:id` | Authenticated | Update a project |
| `DELETE` | `/api/projects/:id` | Authenticated | Delete a project |
| `GET` | `/api/payments` | Authenticated | List payments |
| `POST` | `/api/payments` | Authenticated | Create a payment |
| `PUT` | `/api/payments/:id` | Authenticated | Update a payment |
| `DELETE` | `/api/payments/:id` | Authenticated | Delete a payment |
| `POST` | `/api/ai/generate` | Authenticated | Generate an AI analysis |

`GET /health` is also available without authentication.

## Optional Integrations

Configure these in `.env` to enable their related features:

| Variables | Purpose |
| --- | --- |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | AI analysis; the model defaults to `gemini-3.8-flash` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary file uploads |
| `EMAIL_USER`, `EMAIL_PASSWORD` | Email sending |

## Deployment and Security

See [`RENDER_DEPLOYMENT.md`](RENDER_DEPLOYMENT.md) for Render deployment instructions. The SQL schema includes permissive Supabase row-level security policies; review and tighten those policies before using real or sensitive data in production.

The `npm test` script is currently a placeholder and does not run a test suite.
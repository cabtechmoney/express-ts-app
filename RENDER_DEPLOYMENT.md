# Deploying the Backend to Render

This guide walks through deploying the `express-ts-app` backend to **Render**.

## Option 1: Blueprint (render.yaml) — Recommended

The repository already includes a `render.yaml` blueprint file. Render will detect it automatically when you connect a new web service, or you can use "Blueprint" from a repo.

1. Push your code (including `express-ts-app/render.yaml`) to a GitHub/GitLab repo.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Select the repository.
4. Render will read `render.yaml` and create a **Web Service** named `caleb-crm-api`.
5. For each secret variable (`SUPABASE_URL`, etc.), Render will prompt you to enter a value. Provide the values from your local `.env`.
6. Click **Apply** and wait for the deploy to finish.

## Option 2: Manual Web Service

1. Push your backend code to a GitHub/GitLab repo.
   > If the repo root is the entire project, set **Root Directory** to `express-ts-app`.
2. In Render, click **New +** → **Web Service**.
3. Select your repository, set the **Root Directory** to `express-ts-app`.
4. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
5. Add the environment variables from your `.env` under the **Environment** tab.
6. Click **Create Web Service**.

## Environment Variables Required

| Variable                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `PORT`                  | Render sets this automatically (usually 10000) |
| `NODE_ENV`              | Set to `production`                            |
| `SUPABASE_URL`          | Your Supabase project URL                     |
| `SUPABASE_ANON_KEY`     | Your Supabase anon/public key                 |
| `JWT_SECRET`            | Secret used to sign JWTs                      |
| `EMAIL_USER`            | Gmail address for sending email               |
| `EMAIL_PASSWORD`        | Gmail app password                            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                         |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                            |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                         |
| `OPENAI_API_KEY`        | OpenAI API key (optional)                     |

> **Note:** `PORT` is set automatically by Render. Your app already reads `process.env.PORT` with a fallback of `3000`, so no code change is needed.

## After Deployment

The service will be available at a URL like:
`https://caleb-crm-api.onrender.com`

Health check endpoint:
`https://caleb-crm-api.onrender.com/health`

To point your Next.js frontend at the deployed API, set this env var in your frontend host:

```
NEXT_PUBLIC_API_URL=https://caleb-crm-api.onrender.com/api
```


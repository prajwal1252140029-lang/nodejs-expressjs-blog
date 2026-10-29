# Node.js and Express.js: Building Modern Web Applications

Technical blog website for the **Computer Network and Web Technology (CNWT)** home assignment.
Department of Instrumentation and Control Engineering, VIT Pune.

A working Express.js application: pages are served by real routes, rendered with EJS, and a JSON API returns **simulated** sensor data (not real measurements).

## Routes

| Route | Description |
|---|---|
| `GET /` | Homepage |
| `GET /blog` | Blog listing |
| `GET /blog/nodejs-expressjs` | Full article |
| `GET /about` | About page |
| `GET /api/sensors` | Simulated temperature, pressure, flow (JSON) |
| `GET /api/sensors/:type` | One sensor: `temperature`, `pressure`, `flow` (400 if invalid) |
| `GET /health` | Health check |

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:3000. To use another port: `PORT=4000 npm start` (macOS/Linux) or `set PORT=4000 && npm start` (Windows cmd).

## Structure

```text
server.js            Express app, routes, middleware, error handling
data/posts.js        Author details, post metadata, references (edit your details here)
content/article.md   The article (Markdown, rendered on the article page)
views/               EJS templates (index, blog, article, about, 404, error, partials)
public/css/          Stylesheet
public/js/           Front-end JavaScript (nav, copy buttons, API demo)
```

## Deploy

Push to GitHub, then create a Render Web Service with build command `npm install` and start command `npm start`. See `GUIDE.md`.

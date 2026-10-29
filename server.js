'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const { marked } = require('marked');
const { site, posts, topics, references } = require('./data/posts');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- View engine and global middleware ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      // Avoids forcing https on http://localhost during local testing.
      directives: { 'upgrade-insecure-requests': null }
    }
  })
);

// Reusable middleware: simple request logger.
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
}
app.use(requestLogger);

// Reusable middleware: values available in every EJS template.
app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.references = references;
  res.locals.currentPath = req.path;
  res.locals.title = site.title;
  res.locals.description =
    'Technical blog on Node.js and Express.js by a student of Instrumentation and Control Engineering, VIT Pune.';
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Article rendering (Markdown -> HTML, done once at startup) ---------- */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/i\/o/g, 'io')
    .replace(/[./]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderArticle() {
  const markdown = fs.readFileSync(path.join(__dirname, 'content', 'article.md'), 'utf8');
  const toc = [];
  const renderer = new marked.Renderer();
  renderer.heading = (text, level, raw) => {
    const id = slugify(raw.replace(/^\d+\.\s*/, ''));
    if (level === 2) toc.push({ id, title: raw });
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };
  const html = marked.parse(markdown, { renderer });
  return { html, toc };
}
const article = renderArticle();

/* ---------- Simulated sensor data ---------- */
const SENSORS = {
  temperature: { unit: '°C', base: 72.5, spread: 1.5, location: 'Heat-exchanger outlet (simulated)' },
  pressure: { unit: 'kPa', base: 310, spread: 6, location: 'Process line header (simulated)' },
  flow: { unit: 'L/min', base: 42, spread: 2, location: 'Feed pipe (simulated)' }
};

function simulate(name) {
  const s = SENSORS[name];
  const value = s.base + (Math.random() * 2 - 1) * s.spread;
  return { sensor: name, value: Number(value.toFixed(1)), unit: s.unit, location: s.location };
}

const DATA_NOTICE =
  'SAMPLE DATA: values are randomly generated around fixed baselines for demonstration. They are NOT measurements from real sensors.';

/* ---------- Page routes ---------- */
app.get('/', (req, res) => {
  res.render('index', { post: posts[0] });
});

app.get('/blog', (req, res) => {
  res.render('blog', { title: 'Blog | ' + site.shortTitle, posts, topics });
});

app.get('/blog/:slug', (req, res, next) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return next(); // falls through to the 404 handler
  res.render('article', {
    title: post.title,
    description: post.summary,
    post,
    content: article.html,
    toc: article.toc
  });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About | ' + site.shortTitle });
});

/* ---------- API routes ---------- */
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/sensors', (req, res) => {
  res.json({
    dataSource: 'simulated',
    notice: DATA_NOTICE,
    timestamp: new Date().toISOString(),
    readings: Object.keys(SENSORS).map(simulate)
  });
});

app.get('/api/sensors/:type', (req, res) => {
  const type = req.params.type.toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(SENSORS, type)) {
    return res.status(400).json({
      error: `Unknown sensor type "${req.params.type}".`,
      allowed: Object.keys(SENSORS)
    });
  }
  res.json({
    dataSource: 'simulated',
    notice: DATA_NOTICE,
    timestamp: new Date().toISOString(),
    reading: simulate(type)
  });
});

/* ---------- 404 and error handling ---------- */
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found.' });
  }
  res.status(404).render('404', { title: 'Page not found | ' + site.shortTitle });
});

// Error-handling middleware has four arguments.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
  res.status(500).render('error', { title: 'Server error | ' + site.shortTitle });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

'use strict';

// Edit these values to match your details before submission.
const site = {
  title: 'Node.js and Express.js: Building Modern Web Applications',
  shortTitle: 'Node & Express Blog',
  author: 'Prajwal Ramesh Molak',
  program: 'Third-Year B.Tech, Instrumentation and Control Engineering',
  department: 'Department of Instrumentation and Control Engineering',
  institution: 'Vishwakarma Institute of Technology (VIT), Pune',
  subject: 'Computer Network and Web Technology (CNWT)',
  year: 2026
};

const posts = [
  {
    slug: 'nodejs-expressjs',
    title: site.title,
    summary:
      'A beginner-friendly guide to server-side JavaScript: the Node.js event loop, Express routing and middleware, REST APIs, and a simulated industrial IoT sensor API.',
    abstract:
      'Web applications depend on servers that receive HTTP requests and return responses. This article explains how Node.js executes JavaScript outside the browser using an event-driven, non-blocking architecture, and how Express.js builds on Node.js to simplify routing, middleware and REST API development. It walks through a working code example, then applies the same ideas to an Instrumentation and Control scenario: an API that serves simulated temperature, pressure and flow readings. The article separates simulated data from real hardware measurements and discusses advantages, limitations, security considerations and future scope.',
    keywords: [
      'Node.js', 'Express.js', 'Event loop', 'Non-blocking I/O', 'Middleware',
      'REST API', 'HTTP', 'Industrial IoT', 'Instrumentation and Control'
    ],
    readTime: '15 min read',
    tags: ['Node.js', 'Express.js', 'REST API', 'Industrial IoT']
  }
];

// Topic cards link to section anchors inside the main article.
const topics = [
  { title: 'What is Node.js?', text: 'The V8-powered runtime that lets JavaScript run on the server.', anchor: 'what-is-nodejs' },
  { title: 'The Event Loop', text: 'How one thread handles many connections with non-blocking I/O.', anchor: 'event-loop-and-non-blocking-io' },
  { title: 'What is Express.js?', text: 'Routing, middleware and error handling on top of Node.js.', anchor: 'what-is-expressjs' },
  { title: 'Node.js vs Express.js', text: 'A side-by-side comparison of the runtime and the framework.', anchor: 'nodejs-vs-expressjs' },
  { title: 'REST APIs', text: 'GET, POST, PUT and DELETE with a working example.', anchor: 'rest-apis-and-http-methods' },
  { title: 'Industrial IoT Monitoring', text: 'Temperature, pressure and flow data served through an API.', anchor: 'industrial-iot-monitoring-example' }
];

const references = [
  { label: 'Node.js Documentation', url: 'https://nodejs.org/en/docs' },
  { label: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html' },
  { label: 'MDN: Express/Node introduction', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Server-side/Express_Nodejs' },
  { label: 'MDN: HTTP overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
  { label: 'Express security best practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html' }
];

module.exports = { site, posts, topics, references };

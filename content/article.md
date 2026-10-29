## 1. Web Servers and Server-Side Programming

Every time you open a website, your browser (the **client**) sends a request over the internet to a **web server**, and the server sends back a response. A web server is software running on a computer that listens for requests using the HTTP protocol and replies with content such as HTML pages, images, or JSON data.

Servers deliver two broad kinds of content:

- **Static content:** files that are sent exactly as stored, such as an HTML file or an image.
- **Dynamic content:** responses generated at request time, for example a page showing the latest sensor readings or a search result.

**Server-side programming** is the code that runs on the server to produce dynamic content. It handles business logic, reads and writes databases, checks authentication, and prepares the response. This differs from **client-side programming**, where JavaScript runs inside the browser. Historically, server-side code was written in languages such as PHP, Java, Python or C#. Node.js made it possible to use JavaScript on both sides, so one language can power the whole application.

## 2. What Is Node.js?

Node.js is an open-source, cross-platform **JavaScript runtime environment**. It lets JavaScript run outside a web browser, for example on a laptop, a server or a Raspberry Pi. It was created by Ryan Dahl and first released in 2009.

Node.js is not a language and not a framework. The language is JavaScript; Node.js is the environment that executes it. It uses Google's **V8** engine (the same engine used in Chrome) to compile JavaScript into machine code, and a C library called **libuv** to handle asynchronous input/output and the event loop.

A minimal web server using only Node.js's built-in `http` module looks like this:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js\n');
});

server.listen(3000, () => console.log('Listening on port 3000'));
```

Run it with `node server.js` and open `http://localhost:3000` to see the message.

## 3. Features and Architecture of Node.js

**Key features**

- **Asynchronous and event-driven:** operations such as reading a file or querying a database do not block the program while they wait.
- **Non-blocking I/O:** a single process can serve many connections at the same time.
- **Fast execution:** V8 compiles JavaScript to machine code.
- **npm ecosystem:** the Node Package Manager gives access to a very large registry of reusable packages.
- **Built-in modules:** `http`, `fs` (file system), `path`, `os`, `events`, `stream` and others ship with Node.js.
- **Cross-platform:** the same code runs on Windows, macOS and Linux.
- **JSON-friendly:** JavaScript objects map naturally to JSON, the common data format for web APIs.

**Simplified architecture**

```text
+---------------------------------------------+
|  Your application code (JavaScript)         |
+---------------------------------------------+
|  Node.js core modules (http, fs, events...) |
+---------------------------------------------+
|  Node.js bindings (C++)                     |
+-------------------------+-------------------+
|  V8 engine              |  libuv            |
|  (runs JavaScript)      |  (event loop,     |
|                         |   async I/O)      |
+-------------------------+-------------------+
|  Operating system (files, network, timers)  |
+---------------------------------------------+
```

Your code calls core modules; those call into V8 and libuv, which talk to the operating system.

## 4. Event Loop and Non-Blocking I/O

Traditional servers often create one thread per connection. Node.js instead runs your JavaScript on a **single main thread** and relies on an **event loop** to coordinate work.

The idea is simple. When your code starts a slow operation (reading a file, calling a database, waiting for a network reply), Node.js hands it to the operating system or to libuv's internal thread pool and **keeps running other code**. When the operation finishes, its callback is placed in a queue. The event loop picks up queued callbacks and runs them one at a time on the main thread.

The loop moves through phases. In simplified form:

1. **Timers:** runs callbacks from `setTimeout` and `setInterval` whose time has elapsed.
2. **Pending callbacks:** runs certain deferred system callbacks.
3. **Poll:** retrieves new I/O events and runs their callbacks.
4. **Check:** runs `setImmediate` callbacks.
5. **Close callbacks:** runs cleanup callbacks such as a closed socket.

Promise callbacks and `process.nextTick` run in separate "microtask" queues, which are processed between phases. The following program shows the effect:

```js
console.log('1. Start');

setTimeout(() => console.log('4. Timer (macrotask)'), 0);

Promise.resolve().then(() => console.log('3. Promise (microtask)'));

console.log('2. End');
```

**Output**

```text
1. Start
2. End
3. Promise (microtask)
4. Timer (macrotask)
```

Even with a delay of 0 ms, the timer callback runs after the current code finishes and after the promise callback.

**Blocking versus non-blocking**

```js
const fs = require('fs');

// Blocking: nothing else can run until the file is read
const data = fs.readFileSync('data.txt', 'utf8');

// Non-blocking: Node.js continues, then calls back when ready
fs.readFile('data.txt', 'utf8', (err, content) => {
  if (err) return console.error(err);
  console.log(content);
});
```

**Important limitation:** because JavaScript runs on one main thread, a long CPU-heavy calculation blocks every other request. For such work, Node.js provides `worker_threads`, or the work can be moved to another service.

## 5. What Is Express.js?

Express.js is a minimal, flexible **web application framework for Node.js**. It is installed as an npm package and sits on top of Node's `http` module. It does not replace Node.js; it makes common server tasks shorter and more organised: matching URLs to code, reading request data, sending responses, and chaining reusable processing steps.

Express is described as *unopinionated*: it does not force a particular project layout or database. This makes it easy to learn, and it is widely used as the foundation for REST APIs and server-rendered websites. This project uses Express 4.x; Express 5 is also available, and the official site documents the differences.

## 6. Features of Express.js: Routing and Middleware

### Routing

A **route** connects an HTTP method and a URL path to a handler function.

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Home'));

// Route parameter: /sensors/temperature
app.get('/sensors/:type', (req, res) => {
  res.json({ requested: req.params.type });
});

// Query string: /search?term=pressure
app.get('/search', (req, res) => {
  res.json({ term: req.query.term });
});
```

### Middleware

**Middleware** functions have access to the request (`req`), the response (`res`) and the `next` function. Each one can read or modify the request, end the response, or call `next()` to pass control onward. Express runs middleware in the order it is registered.

```js
// Application-level middleware: runs for every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Built-in middleware
app.use(express.json());              // parses JSON request bodies
app.use(express.static('public'));    // serves files from the public folder
```

### Other features

- **Error-handling middleware:** a function with four parameters `(err, req, res, next)` catches errors.
- **Template engines:** EJS, Pug and others render HTML with dynamic data. This project uses EJS.
- **Response helpers:** `res.json()`, `res.status()`, `res.redirect()`, `res.render()`.
- **Large ecosystem:** third-party middleware for security headers, logging, sessions and more.

## 7. Node.js vs Express.js

| Aspect | Node.js | Express.js |
|---|---|---|
| What it is | JavaScript runtime environment | Web framework (an npm package) |
| Purpose | Run JavaScript outside the browser | Build web apps and APIs faster |
| Depends on | V8 and libuv | Node.js |
| Provides | Core modules: `http`, `fs`, `path`, `events` | Routing, middleware, response helpers, template support |
| Routing | Written manually by inspecting `req.url` and `req.method` | Built in: `app.get()`, `app.post()` and so on |
| Installation | Installed on the system from nodejs.org | `npm install express` inside a project |
| Can be used alone? | Yes | No, it always runs on Node.js |

The same two routes written both ways show the difference:

```js
// Plain Node.js
const http = require('http');
http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.end('Home');
  } else if (req.method === 'GET' && req.url === '/about') {
    res.end('About');
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(3000);

// Express.js
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Home'));
app.get('/about', (req, res) => res.send('About'));
app.listen(3000);
```

## 8. Client-Server Architecture and the HTTP Lifecycle

In the **client-server model**, clients (browsers, mobile apps, microcontrollers) request resources and servers provide them. **HTTP** is the protocol they use. It is *stateless*: each request is independent, and the server does not automatically remember earlier ones.

**Lifecycle of a request**

1. The user enters a URL such as `https://example.com/api/sensors`.
2. **DNS** translates the domain name into an IP address.
3. The browser opens a **TCP connection** to the server (and a **TLS** handshake if the URL uses HTTPS).
4. The browser sends an **HTTP request**: a method (`GET`), a path (`/api/sensors`), headers and optionally a body.
5. The Node.js process receives the request and Express starts running its **middleware chain**.
6. Express matches the **route** and runs its handler.
7. The handler sends an **HTTP response**: a status code, headers and a body.
8. The client processes the response, for example by rendering HTML or reading JSON.

```text
Client                         Server (Node.js + Express)
  |  --- GET /api/sensors --->    middleware -> route handler
  |  <--- 200 OK + JSON -----     
```

**Common status code classes**

| Range | Meaning | Example |
|---|---|---|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently |
| 4xx | Client error | 400 Bad Request, 404 Not Found |
| 5xx | Server error | 500 Internal Server Error |

## 9. REST APIs and HTTP Methods

A **REST API** (Representational State Transfer) exposes *resources* through URLs and uses standard HTTP methods to act on them. REST is an architectural style with ideas such as a client-server split, stateless requests and a uniform interface. Data is most often exchanged as JSON.

| Method | Purpose | Example | Typical success code |
|---|---|---|---|
| GET | Read a resource | `GET /api/devices` | 200 |
| POST | Create a resource | `POST /api/devices` | 201 |
| PUT | Replace or update a resource | `PUT /api/devices/2` | 200 |
| DELETE | Remove a resource | `DELETE /api/devices/2` | 204 (or 200) |

GET, PUT and DELETE are *idempotent*: repeating the same request leaves the server in the same state. POST is not, since each call may create a new resource. Good API design uses nouns in URLs (`/devices`), not verbs (`/getDevices`).

## 10. A Practical Example: A Minimal Express Server

This example builds a small REST API that manages a list of devices in memory. It includes middleware, all four methods and input validation.

**Prerequisite:** install the LTS version of Node.js from nodejs.org, then check it:

```bash
node --version
npm --version
```

**Installation**

```bash
mkdir express-demo
cd express-demo
npm init -y
npm install express
```

**Create `app.js`**

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON bodies and log every request
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory data (resets when the server restarts)
const devices = [{ id: 1, name: 'Temperature Sensor', unit: '°C' }];
let nextId = 2;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// READ: list all devices
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

// CREATE: add a device (with basic validation)
app.post('/api/devices', (req, res) => {
  const { name, unit } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ error: 'name and unit are required' });
  }
  const device = { id: nextId++, name, unit };
  devices.push(device);
  res.status(201).json(device);
});

// UPDATE: replace a device
app.put('/api/devices/:id', (req, res) => {
  const device = devices.find((d) => d.id === Number(req.params.id));
  if (!device) return res.status(404).json({ error: 'Device not found' });
  const { name, unit } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ error: 'name and unit are required' });
  }
  device.name = name;
  device.unit = unit;
  res.json(device);
});

// DELETE: remove a device
app.delete('/api/devices/:id', (req, res) => {
  const index = devices.findIndex((d) => d.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Device not found' });
  devices.splice(index, 1);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

**How it works:** `express.json()` parses JSON request bodies into `req.body`. The logging middleware calls `next()` so the request continues to the matching route. Each route validates its input and returns a suitable status code.

**Run and test** (start the server in one terminal, then use a second terminal):

```bash
node app.js
```

```bash
curl http://localhost:3000/api/devices
curl -X POST http://localhost:3000/api/devices -H "Content-Type: application/json" -d '{"name":"Pressure Sensor","unit":"kPa"}'
curl -X PUT http://localhost:3000/api/devices/2 -H "Content-Type: application/json" -d '{"name":"Pressure Transmitter","unit":"kPa"}'
curl -X DELETE http://localhost:3000/api/devices/2
```

**Output** (as observed when running this code)

```text
GET list      -> [{"id":1,"name":"Temperature Sensor","unit":"°C"}]
POST valid    -> 201 Created  {"id":2,"name":"Pressure Sensor","unit":"kPa"}
POST invalid  -> 400 Bad Request  {"error":"name and unit are required"}
PUT           -> {"id":2,"name":"Pressure Transmitter","unit":"kPa"}
DELETE        -> 204 No Content (empty body)
```

Server console:

```text
Server running on http://localhost:3000
GET /api/devices
POST /api/devices
PUT /api/devices/2
DELETE /api/devices/2
```

On Windows PowerShell, `curl` is an alias for another command; use `curl.exe` or a tool such as Postman or a browser for the GET requests.

## 11. Real-World Application in Instrumentation and Control Engineering

In industrial automation, field instruments (transmitters, sensors, actuators) are connected to controllers such as PLCs or DCS systems that perform the actual control. Web technologies sit **above** that layer, in the supervision and information layer. Node.js and Express are used there for tasks such as:

- Providing a **REST API** that exposes plant or lab data to dashboards and mobile apps.
- Acting as a **gateway or aggregator** that collects data from several devices, protocols or databases and presents it in one consistent JSON format.
- Serving **web-based dashboards** for monitoring trends, alarms and equipment status.
- Building **data-logging services** that store readings with timestamps for later analysis.
- Creating **lab and teaching tools**, for example a web interface to a data-acquisition setup.

Node.js has community libraries for industrial and IoT protocols, such as `mqtt` for MQTT, `node-opcua` for OPC UA and `modbus-serial` for Modbus. These are examples of what the ecosystem offers; this project does not use them.

**An important boundary:** Node.js is not intended for hard real-time, deterministic control loops. Time-critical closed-loop control belongs in PLCs, DCS controllers or dedicated embedded firmware. A Node.js and Express layer is suited to monitoring, visualisation and integration.

## 12. Industrial IoT Monitoring Example

Consider a process line with three measured variables: **temperature** (°C), **pressure** (kPa) and **flow rate** (L/min). A typical monitoring architecture is:

```text
Sensors -> Controller / microcontroller -> Gateway -> Express API -> Dashboard
(temp, pressure, flow)  (signal conditioning,     (HTTP / MQTT)  (JSON)     (browser)
                         ADC, PLC)
```

### Simulated data versus real measurements

This project's website **does not use real sensors**. The `/api/sensors` endpoint generates random values around fixed baselines to demonstrate how such an API behaves. The response states this explicitly.

| | Simulated data (this project) | Real hardware measurements |
|---|---|---|
| Source | Random numbers generated in code | Physical sensors and signal conditioning |
| Accuracy | Not meaningful | Depends on sensor, calibration and noise |
| Use | Demonstration and testing of the API | Actual monitoring and decisions |
| Extra concerns | None | Calibration, sampling rate, noise, sensor faults, timestamps |

### The sensor API code

```js
const SENSORS = {
  temperature: { unit: '°C',    base: 72.5, spread: 1.5, location: 'Heat-exchanger outlet (simulated)' },
  pressure:    { unit: 'kPa',   base: 310,  spread: 6,   location: 'Process line header (simulated)' },
  flow:        { unit: 'L/min', base: 42,   spread: 2,   location: 'Feed pipe (simulated)' }
};

function simulate(name) {
  const s = SENSORS[name];
  const value = s.base + (Math.random() * 2 - 1) * s.spread;
  return { sensor: name, value: Number(value.toFixed(1)), unit: s.unit, location: s.location };
}

app.get('/api/sensors', (req, res) => {
  res.json({
    dataSource: 'simulated',
    notice: 'SAMPLE DATA: not real measurements.',
    timestamp: new Date().toISOString(),
    readings: Object.keys(SENSORS).map(simulate)
  });
});
```

### Example response

Values differ on each request because they are random. A typical response looks like this:

```json
{
  "dataSource": "simulated",
  "notice": "SAMPLE DATA: values are randomly generated around fixed baselines for demonstration. They are NOT measurements from real sensors.",
  "timestamp": "2026-10-28T09:30:00.000Z",
  "readings": [
    { "sensor": "temperature", "value": 73.1, "unit": "°C", "location": "Heat-exchanger outlet (simulated)" },
    { "sensor": "pressure", "value": 307.4, "unit": "kPa", "location": "Process line header (simulated)" },
    { "sensor": "flow", "value": 43.2, "unit": "L/min", "location": "Feed pipe (simulated)" }
  ]
}
```

### Moving toward real hardware (possible extension)

A microcontroller such as an ESP32 could read a temperature sensor, a pressure transmitter (through suitable signal conditioning) and a flow sensor, then send readings to an Express endpoint with an HTTP `POST` or publish them over MQTT. The server would validate and store them. This is a **future extension and is not implemented in this project**.

## 13. Advantages, Limitations, Security and Applications

**Advantages**

- One language (JavaScript) for the front end and back end.
- Efficient handling of many concurrent, I/O-bound connections.
- Large package ecosystem and active community.
- Express is lightweight and quick to learn.
- Fast prototyping, well suited to a one-day student project.

**Limitations**

- CPU-intensive tasks can block the single main thread.
- Deeply nested callbacks can become hard to read; `async`/`await` helps.
- The ecosystem changes quickly, and third-party packages vary in quality.
- Express is minimal, so developers must choose and assemble many parts themselves.
- Not suited to hard real-time control.

**Security considerations**

- **Validate and sanitise all input** from clients.
- Use **HTTPS** in production.
- Set secure HTTP headers, for example with the Helmet middleware (used in this project).
- Do not expose stack traces or internal errors to users.
- Keep secrets such as API keys in **environment variables**, never in source code or public repositories.
- Run `npm audit` and keep dependencies updated.
- Add **authentication and authorisation** for any non-public endpoint, and consider rate limiting and a restrictive CORS policy.

**Applications**

REST APIs, server-rendered websites, microservices, real-time applications such as chat, streaming services, command-line tools, IoT data gateways and dashboards.

## 14. Future Scope and Conclusion

**Future scope**

- Connecting real sensors through ESP32 or Raspberry Pi and replacing simulated data.
- Storing readings in a database suited to time-series data and plotting trends.
- Live updates with WebSockets or MQTT instead of repeated requests.
- Authentication, alarms and role-based access for a monitoring dashboard.
- Migrating to newer Express versions and adding TypeScript for safer code.
- Automated tests, for example with Node.js's built-in test runner.

**Conclusion**

Node.js provides the runtime that executes JavaScript on the server with an event-driven, non-blocking model. Express.js builds on it with routing and middleware, making it quick to create web pages and REST APIs. For an Instrumentation and Control student, this combination offers a practical way to expose process data to dashboards and other systems, while real-time control remains the job of PLCs and embedded controllers. The accompanying website demonstrates these ideas with working routes, middleware, validation, error handling and a clearly labelled simulated sensor API.

## 15. References

1. Node.js Foundation. *Node.js Documentation.* https://nodejs.org/en/docs
2. Node.js. *The Node.js Event Loop.* https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
3. Express.js. *Express Documentation: Routing.* https://expressjs.com/en/guide/routing.html
4. Express.js. *Using Middleware.* https://expressjs.com/en/guide/using-middleware.html
5. Express.js. *Production Best Practices: Security.* https://expressjs.com/en/advanced/best-practice-security.html
6. MDN Web Docs. *Express/Node introduction.* https://developer.mozilla.org/en-US/docs/Learn_web_development/Server-side/Express_Nodejs
7. MDN Web Docs. *An overview of HTTP.* https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
8. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures* (doctoral dissertation, Chapter 5: REST). https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
9. EJS. *Embedded JavaScript templating.* https://ejs.co/
10. Helmet.js. https://helmetjs.github.io/

# Step-by-step guide: test, publish, deploy, submit

## 0. Before you start
1. Install the **LTS** Node.js from https://nodejs.org and Git from https://git-scm.com.
2. Open `data/posts.js` and check your name and details. Remove or add anything your department requires (for example PRN or division).

## 1. Test locally
```bash
cd nodejs-expressjs-blog
npm install
npm start
```
Open http://localhost:3000 and check: `/`, `/blog`, `/blog/nodejs-expressjs`, `/about`, `/api/sensors`, `/api/sensors/flow`, `/api/sensors/humidity` (expect 400) and `/anything-else` (expect the 404 page). On the article page, use the **Live API demo** buttons.

API tests from a second terminal:
```bash
curl http://localhost:3000/api/sensors
curl http://localhost:3000/api/sensors/pressure
curl -i http://localhost:3000/api/sensors/humidity
```
(On Windows PowerShell use `curl.exe`.)

## 2. Publish the article (Hashnode, free)
1. Sign up at https://hashnode.com and create your free blog (you get a `yourname.hashnode.dev` address).
2. Click **Write** (new article).
3. Title: `Node.js and Express.js: Building Modern Web Applications`.
4. Open `ARTICLE.md`, copy everything **after the first `# ` title line**, and paste it into the editor. Hashnode's editor accepts Markdown, so headings (`##`), tables, links and code fences (```js) keep their formatting.
5. Cover image: use the cover option in the editor and upload a 1600 x 840 px image (a Canva design or a screenshot of your website's homepage works well). Only use images you created or are allowed to use.
6. Add tags such as `nodejs`, `expressjs`, `javascript`, `api`.
7. Check the preview: code blocks should be highlighted, the tables should render, and the reference links should be clickable.
8. Click **Publish**. Open the published article and copy the URL from the browser address bar. This is **URL 1**.

**Medium alternative:** Medium does not render Markdown tables well, so Hashnode is easier. If you use Medium, paste the text, use `Title`/`Subtitle` heading styles, type three backticks to create code blocks, and replace tables with screenshots or lists.

Hashnode and Medium change their screens from time to time; if a button has moved, look for equivalent options.

## 3. Put the code on GitHub
1. Sign in at https://github.com and click **New repository**. Name it `nodejs-expressjs-blog`, set it to **Public**, and do not add a README (the project already has one).
2. In the project folder:
```bash
git init
git add .
git commit -m "Node.js and Express.js blog"
git branch -M main
git remote add origin https://github.com/<your-username>/nodejs-expressjs-blog.git
git push -u origin main
```
3. Refresh the repository page and confirm `server.js`, `views/`, `package.json` and the other files are there. `node_modules` should not be uploaded (`.gitignore` handles it).

(No Git? On the repository page choose **Add file > Upload files** and drag in the project files and folders, but not `node_modules`.)

## 4. Deploy on Render (free tier)
1. Sign up at https://render.com (you can sign in with GitHub).
2. **New > Web Service**, then connect your GitHub account and select `nodejs-expressjs-blog`.
3. Settings:
   - **Language/Runtime:** Node
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Environment variables: none are required. Render sets `PORT` automatically and the app reads it through `process.env.PORT`. If you want to pin a Node version, add `NODE_VERSION` (for example `20`).
5. Click **Create Web Service** and wait for the build log to show the service is live.
6. Open the URL Render shows (it looks like `https://nodejs-expressjs-blog-xxxx.onrender.com`). This is **URL 2**.

### Verify the deployment
- Open `/`, `/blog`, `/blog/nodejs-expressjs` and `/about` on the Render URL.
- Test the API in the browser or with `curl https://<your-app>.onrender.com/api/sensors`. The JSON should say `"dataSource": "simulated"`.
- Open a wrong URL and check the 404 page appears.

### Free hosting limitations
- Free web services on Render may **spin down after a period of inactivity**, and the first request afterwards can take noticeably longer (often up to about a minute) while the service restarts. Open the site shortly before your evaluation to wake it up.
- Free-tier limits and policies change. Check https://render.com/docs/free for the current terms before relying on them.
- Never assume a paid feature is free; the steps above use only the Free instance type.

### Troubleshooting
| Problem | Likely cause and fix |
|---|---|
| Build fails with `Cannot find module` | A dependency is missing from `package.json`. Run `npm install` locally, commit `package.json` (and `package-lock.json`), push again. |
| "No open ports detected" / deploy times out | The app must listen on `process.env.PORT`. `server.js` already does. Make sure the start command is `npm start`. |
| `Cannot find module 'ejs'` or template errors | `views/` folder or file names were changed or not pushed. Check names and case: Linux is case-sensitive. |
| Page loads without styling | `public/` folder was not pushed, or the path is wrong. Check `public/css/style.css` exists on GitHub. |
| Site very slow on first open | Free instance waking from sleep. Wait and refresh. |
| Works locally but not online | Read the Render **Logs** tab; the first error line usually names the cause. |

## 5. Final checklist
- [ ] Name and details in `data/posts.js` are correct
- [ ] `npm install` and `npm start` work locally; all routes tested
- [ ] Article published on Hashnode or Medium, with cover image and working code formatting
- [ ] Published article URL opens in a private/incognito window
- [ ] Code pushed to a public GitHub repository
- [ ] Render service is live; home, blog, article, about, API and 404 verified
- [ ] Opened the site shortly before submission to avoid sleep delay
- [ ] Article and site both state that sensor data is simulated
- [ ] References checked: every link opens
- [ ] Submit the two URLs below

## 6. URLs to submit
1. Published article URL: `________________________` (fill in after publishing)
2. Deployed website URL: `________________________` (fill in after deploying)

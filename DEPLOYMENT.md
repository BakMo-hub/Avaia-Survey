# Deployment Guide

This guide covers how to deploy the Avaia Survey to various platforms.

## Table of Contents
1. [Local Development](#local-development)
2. [GitHub Pages](#github-pages)
3. [Vercel](#vercel)
4. [Netlify](#netlify)
5. [AWS](#aws)
6. [Docker](#docker)
7. [Custom Server](#custom-server)

---

## Local Development

### Using Python
```bash
# Python 3.x
python3 -m http.server 8000

# Navigate to http://localhost:8000
```

### Using Node.js
```bash
# Using npx (no installation needed)
npx http-server -p 8000 -o

# Or with npm
npm install -g http-server
http-server -p 8000 -o
```

### Using Node.js Live Server
```bash
npm install -g live-server
live-server
```

---

## GitHub Pages

### Setup
1. Ensure repository is on GitHub (public or private)
2. Push code to main branch

### Enable GitHub Pages
1. Go to repository **Settings**
2. Navigate to **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: Select `main` (or your default branch)
   - **Folder**: `/root`
4. Click **Save**

Your survey will be live at: `https://yourusername.github.io/Avaia-Survey`

### Custom Domain
1. In Settings > Pages
2. Under "Custom domain", enter your domain (e.g., survey.avaia.app)
3. Update DNS CNAME record with GitHub's IP

---

## Vercel

### Using CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to link project
```

### Using Web Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select this repository
5. Click "Deploy"

Your survey will be live at: `https://avaia-survey.vercel.app`

### Environment Variables (Optional)
Create `vercel.json`:
```json
{
  "buildCommand": "echo 'No build required'",
  "outputDirectory": ".",
  "env": {
    "API_ENDPOINT": "@api_endpoint"
  }
}
```

---

## Netlify

### Method 1: Drag & Drop
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the project folder
3. Your site is live instantly!

### Method 2: GitHub Integration
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub account
4. Select repository
5. Click "Deploy"

### Configure Redirects
Create `netlify.toml`:
```toml
[build]
  command = "echo 'No build required'"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Your survey will be live at: `https://avaia-survey.netlify.app`

---

## AWS

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Select GitHub and authorize
   - Select repository and branch

2. **Build Settings**
   ```yaml
   version: 1
   backend:
     phases:
       build:
         commands:
           - echo "No build step"
   frontend:
     phases:
       build:
         commands:
           - echo "No build step"
     artifacts:
       baseDirectory: /
       files:
         - '**/*'
   ```

3. **Deploy** - Click "Save and deploy"

### Using AWS S3 + CloudFront

```bash
# 1. Create S3 bucket
aws s3 mb s3://avaia-survey

# 2. Enable static website hosting
aws s3 website s3://avaia-survey \
  --index-document index.html \
  --error-document index.html

# 3. Upload files
aws s3 sync . s3://avaia-survey --exclude ".git/*"

# 4. Set bucket policy (allow public read)
# Create bucket-policy.json:
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::avaia-survey/*"
  }]
}

aws s3api put-bucket-policy \
  --bucket avaia-survey \
  --policy file://bucket-policy.json
```

---

## Docker

### Basic Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY . .

EXPOSE 8000

CMD ["python3", "-m", "http.server", "8000"]
```

### Build & Run
```bash
# Build image
docker build -t avaia-survey .

# Run container
docker run -p 8000:8000 avaia-survey

# Access at http://localhost:8000
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  survey:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
    restart: unless-stopped
```

Run with:
```bash
docker-compose up
```

---

## Custom Server

### Node.js Express
Create `server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(express.json());

// API endpoint for survey submission
app.post('/api/survey/submit', (req, res) => {
    console.log('Survey Data:', req.body);
    // Store in database here
    res.json({ success: true, message: 'Survey received' });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Survey running on http://localhost:${PORT}`);
});
```

Run with:
```bash
node server.js
```

### Python Flask
Create `app.py`:
```python
from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/survey/submit', methods=['POST'])
def submit_survey():
    data = request.json
    data['timestamp'] = datetime.now().isoformat()
    
    # Store data (implement your storage logic)
    print(f"Survey submitted: {json.dumps(data, indent=2)}")
    
    return jsonify({'success': True, 'message': 'Survey received'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

Run with:
```bash
pip install flask
python app.py
```

---

## Environment Variables

Create `.env` file:
```
API_ENDPOINT=https://api.avaia.app/survey
ANALYTICS_ID=YOUR_GOOGLE_ANALYTICS_ID
ENVIRONMENT=production
```

---

## Performance Optimization

### Minification
Use online tools or build processes to minify CSS/JS:
- [MinifyCode.com](https://minifycode.com/)
- [TinyPNG](https://tinypng.com/) for images

### Caching Headers
Add to your server config:
```
# Cache HTML for 1 hour
Cache-Control: max-age=3600

# Cache CSS/JS for 1 year
Cache-Control: max-age=31536000, immutable
```

### CDN Integration
- Cloudflare (free tier available)
- CloudFront (AWS)
- KeyCDN

---

## SSL/Security

### HTTPS Setup
- GitHub Pages: ✅ Automatic
- Vercel: ✅ Automatic
- Netlify: ✅ Automatic
- Custom Server: Use Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Domain Setup

### Point Domain to Deployment

**For GitHub Pages:**
Add CNAME file with:
```
yourusername.github.io
```

**For Vercel:**
Add CNAME record:
```
cname.vercel-dns.com
```

**For Netlify:**
Add CNAME record:
```
awesomesite.netlify.app
```

---

## Monitoring & Analytics

### Google Analytics
Add to `<head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry Error Tracking
```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
</script>
```

---

## Troubleshooting

### Issue: 404 on Refresh
**Solution**: Configure server to serve index.html for all routes
- GitHub Pages: Works automatically
- Vercel/Netlify: Set redirect rules
- Custom Server: Add fallback route to index.html

### Issue: CORS Errors
**Solution**: Enable CORS on backend
```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

### Issue: Slow Loading
**Solution**: 
- Enable gzip compression
- Use CDN
- Minify assets
- Use caching headers

---

## Monitoring Production

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) (free)
- [StatusPage.io](https://www.statuspage.io/)

### Error Tracking
- [Sentry](https://sentry.io/)
- [Bugsnag](https://www.bugsnag.com/)

### Analytics
- [Plausible](https://plausible.io/) (privacy-friendly)
- [Fathom Analytics](https://usefathom.com/)
- Google Analytics

---

## Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Survey

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback Plan

Always maintain backups:
```bash
# Before deploying
git tag -a v1.0 -m "Production version"
git push origin v1.0

# If needed, rollback
git checkout v1.0
# Redeploy
```

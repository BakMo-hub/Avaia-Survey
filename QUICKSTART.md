# Quick Start Guide

Get the Avaia Survey up and running in minutes!

## 📋 Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Deploying Online](#deploying-online)
- [Customizing the Survey](#customizing-the-survey)
- [Backend Integration](#backend-integration)
- [Troubleshooting](#troubleshooting)

---

## Requirements

- **Minimum**: A web browser (Chrome, Firefox, Safari, Edge)
- **For local testing**: Python 3 OR Node.js OR Docker
- **For backend**: Node.js 14+ (optional)

---

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/Avaia-Survey.git
cd Avaia-Survey
```

### Step 2: No Build Required!
This is a static site - no dependencies to install. You can start using it immediately.

**Optional**: If using the backend example:
```bash
npm install
```

---

## Running Locally

### Method 1: Python (Recommended for most users)
```bash
# Python 3.x (most systems have this)
python3 -m http.server 8000

# Then open your browser to: http://localhost:8000
```

**Stop the server**: Press `Ctrl+C`

### Method 2: Node.js
```bash
# Using npx (no installation needed)
npx http-server -p 8000 -o

# Or install globally
npm install -g http-server
http-server -p 8000
```

### Method 3: Node.js Live Server (with auto-reload)
```bash
npm install -g live-server
live-server
```

### Method 4: Docker
```bash
docker run -p 8000:8000 -v $(pwd):/app -w /app python:3.9 \
  python3 -m http.server 8000
```

---

## Deploying Online

### The Easiest Way: GitHub Pages (Free, 2 minutes)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository → Settings
   - Scroll to "Pages"
   - Select `main` branch
   - Click Save

3. **Your survey is live!**
   - Visit: `https://yourusername.github.io/Avaia-Survey`

### Alternative Options

#### Vercel (Free, 1 minute)
```bash
npm install -g vercel
vercel
```
Your site: `https://avaia-survey.vercel.app`

#### Netlify (Free, drag & drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the project folder
3. Done! Your site is live

#### Heroku (Free tier deprecated, paid options available)
```bash
heroku create your-survey-name
git push heroku main
```

---

## Customizing the Survey

### Change Questions
Edit `index.html` in the survey form. Each question is in its own `<div class="form-group">`.

**Example**: Change "How often do you travel?" to "How often do you take group trips?"
```html
<!-- Find this in index.html around line 50 -->
<label for="q1">How often do you travel with a group of international friends or classmates?</label>

<!-- Change to -->
<label for="q1">How often do you take group trips?</label>
```

### Change Colors
Edit `styles.css` - look for the `:root` section at the top:
```css
:root {
    --primary-color: #6366f1;      /* Main color */
    --primary-dark: #4f46e5;       /* Darker shade */
    --success-color: #10b981;      /* Success/submit button */
}
```

Try online color pickers:
- [Adobe Color Picker](https://color.adobe.com/)
- [Coolors.co](https://coolors.co/)

### Change Survey Title
In `index.html`, find the header:
```html
<h1>Avaia Survey</h1>
<p class="subtitle">Help us understand your group travel expense challenges</p>
```

Change to your preferred title and subtitle.

### Add New Questions
1. Add a new `<fieldset class="survey-section">` in `index.html`
2. Add form fields inside it
3. Update `TOTAL_SECTIONS` in `script.js`:
   ```javascript
   const TOTAL_SECTIONS = 7; // Change from 6 to 7
   ```

---

## Backend Integration

### Option 1: Simple REST API (Beginner)
The survey currently logs data to browser console. To send to a backend:

1. **Edit the next part of `script.js`**:
   ```javascript
   function sendSurveyData(data) {
       fetch('https://your-api.com/survey/submit', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
       })
       .then(res => res.json())
       .then(result => showSuccessMessage())
       .catch(err => console.error('Error:', err));
   }
   ```

2. **Your backend should expect JSON like**:
   ```json
   {
     "travelFrequency": "Very frequently",
     "groupSize": "4-6",
     "email": "user@example.com",
     ...
   }
   ```

### Option 2: Use the Example Backend (Intermediate)
We provide a Node.js/Express backend example:

```bash
# Install dependencies
npm install express cors body-parser

# Run the backend server
node backend-example.js

# Now open http://localhost:3000 in your browser
# Survey submissions will be stored in the backend
```

To use it from the survey, update `script.js`:
```javascript
const API_ENDPOINT = 'http://localhost:3001/api/survey/submit';
```

### Option 3: Use Firebase (Advanced but easiest)
See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for complete Firebase setup.

### Option 4: Use Google Sheets
See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for Google Sheets integration via Apps Script.

---

## Testing

### Test the Survey Locally
1. Open `http://localhost:8000` in your browser
2. Fill out a few fields
3. Refresh the page - your data should still be there (saved locally)
4. Complete the survey and submit
5. Check browser console (F12 → Console tab) to see the submitted data

### Test the Backend
If running backend:
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Submit test survey
curl -X POST http://localhost:3001/api/survey/test

# Get statistics
curl http://localhost:3001/api/survey/stats
```

---

## Collecting Responses

### Option 1: Browser Console (Quick Test)
1. Open survey in browser
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Fill out survey and submit
5. See the JSON data logged in console

### Option 2: Local Storage
The survey automatically saves progress. Access saved data:
```javascript
// Open browser console (F12)
JSON.parse(localStorage.getItem('avaiasurvey_state'))
```

### Option 3: Backend Database
Set up backend to store in:
- **Firebase** - Google's real-time database
- **MongoDB** - NoSQL database
- **PostgreSQL** - Relational database
- **Google Sheets** - Simple spreadsheet storage

See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for detailed setup guides.

---

## Analytics

### Track Survey Completions
Add Google Analytics:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

Then in `script.js`:
```javascript
// Track event when survey is submitted
window.gtag?.('event', 'survey_completed', {
    survey_type: 'avaia_public_interest'
});
```

---

## Common Customizations

### Remove Email Field
Find and delete in `index.html`:
```html
<div class="form-group">
    <label for="email">Email (optional - to get early access updates)</label>
    <input type="email" name="email" id="email" class="input" placeholder="your.email@example.com">
</div>
```

### Make Questions Required
Add `required` attribute:
```html
<input type="radio" name="travelFrequency" value="Rarely" required>
```

### Add Questions to Existing Section
1. Find the section you want (e.g., `<fieldset id="section-2">`)
2. Add a new `<div class="form-group">` inside it
3. Add form fields

Example:
```html
<div class="form-group">
    <label>What's your preferred payment method?</label>
    <div class="radio-group">
        <label class="radio-option">
            <input type="radio" name="paymentMethod" value="Credit Card">
            <span>Credit Card</span>
        </label>
        <label class="radio-option">
            <input type="radio" name="paymentMethod" value="Bank Transfer">
            <span>Bank Transfer</span>
        </label>
    </div>
</div>
```

---

## Troubleshooting

### Survey Won't Save Progress
**Problem**: Refreshing the page loses your answers.
**Solution**: 
- Check if cookies/localStorage are enabled in your browser
- Try a different browser
- Check browser console for errors (F12)

### Form Won't Submit
**Problem**: Clicking "Submit Survey" does nothing.
**Solution**:
- Check browser console for errors (F12 → Console)
- Try submitting to backend if configured
- Ensure all API endpoints are correct

### Styling Looks Broken
**Problem**: Colors or layout don't look right.
**Solution**:
- Hard refresh: `Ctrl+Shift+R` (or `⌘+Shift+R` on Mac)
- Clear browser cache
- Try a different browser

### Backend Connection Error
**Problem**: Getting CORS or connection errors.
**Solution**:
- Ensure backend is running: `node backend-example.js`
- Check API endpoint URL in `script.js`
- Backend should be running on same domain or have CORS enabled
- Use `http://localhost:3001` for local testing

### Can't Deploy to GitHub Pages
**Problem**: Site doesn't show up at GitHub Pages URL.
**Solution**:
1. Make sure repository is public (or pages enabled for private)
2. Check Settings → Pages configuration
3. Ensure branch is set to `main` (or your default branch)
4. Wait 1-2 minutes for deployment to complete

---

## Next Steps

1. **Customize**: Update questions, colors, and branding to match your brand
2. **Deploy**: Get it online using GitHub Pages, Vercel, or Netlify
3. **Share**: Send the survey link to your target audience
4. **Analyze**: Set up backend to collect and analyze responses
5. **Iterate**: Use feedback to improve your product

---

## Getting Help

### Common Resources
- [HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML) - Modify form structure
- [CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS) - Change styling
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Add functionality
- [Firebase Setup](https://firebase.google.com/docs) - Backend database

### Issues & Questions
- Check [README.md](README.md) for detailed documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
- Review [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for backend setup
- Check GitHub Issues in the repository

---

## Performance Tips

1. **Optimize images**: Use [TinyPNG](https://tinypng.com/) if adding images
2. **Minify CSS/JS**: Use online tools to reduce file size
3. **Use CDN**: GitHub Pages includes CDN automatically
4. **Cache**: Set caching headers on backend for better performance

---

## Security Tips

1. **Validate Data**: Server-side validation for all user inputs
2. **Use HTTPS**: All deployment platforms support https
3. **Hide API Keys**: Use environment variables, never commit keys
4. **CORS**: Configure CORS carefully if using backend
5. **Rate Limiting**: Implement on backend to prevent spam

---

## Success Checklist

- [ ] Survey running locally
- [ ] Customized with your questions
- [ ] Deployed online (GitHub Pages/Vercel/Netlify)
- [ ] Share link with target audience
- [ ] Responses being collected
- [ ] Analytics tracking enabled
- [ ] Analyzing results

---

**You're all set!** 🚀 Start collecting valuable feedback for Avaia!

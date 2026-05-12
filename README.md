# ✈️ Avaia — Group Travel Survey

A multi-step feedback survey for the **Avaia** group travel bill-splitting app. Built with pure HTML / CSS / JS and powered by [Web3Forms](https://web3forms.com) — no backend or build tools required.

---

## 🗂️ Files

```
Avaia-Survey/
├── index.html    ← Survey structure (4 sections)
├── styles.css    ← All styles — colours, layout, animations
├── script.js     ← Multi-step logic + Web3Forms submission
└── logo.png      ← Your logo (optional)
```

---

## ⚡ Setup (2 steps)

### 1 — Get a free Web3Forms key

Go to [web3forms.com](https://web3forms.com), enter your email, and copy the access key from your inbox.

### 2 — Add the key to `script.js`

Open `script.js` and replace the placeholder on line 1:

```js
const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY_HERE';
```

That's it. Push to GitHub and your survey is live.

---

## 🚀 Deploy via GitHub Pages

1. Push all files to the `main` branch root
2. Go to **Settings → Pages → Source → main / (root)**
3. Click **Save** — live at `https://<username>.github.io/Avaia-Survey/`

---

## 🎨 Design system

| Token | Value | Used for |
|---|---|---|
| `--primary-color` | `#E31F01` | Buttons, active states, accents |
| `--primary-dark` | `#340405` | Page background |
| `--primary-light` | `#FCE8E5` | Light tints |
| `--secondary-color` | `#8E7D4A` | Progress bar gradient tail |
| `--success-color` | `#10b981` | Submit button, success screen |
| `--text-light` | `#FCE8E5` | Body text on dark bg |
| Font (headings) | Bebas Neue | Section titles, hero |
| Font (body) | DM Sans | Questions, options, buttons |

---

## 📬 How submissions arrive

Each submission is emailed to you with all fields labelled:

```
Traveller type      → Frequent leisure traveller
Trip frequency      → Regularly — 4 to 6 times
Group size          → 3 to 5 people
Biggest frustration → Losing track of who paid what
Current solution    → Splitwise or similar
Satisfaction (1-5)  → 2 / 5
Desired features    → Real-time tracker, Currency conversion
NPS (0-10)          → 9 / 10
Follow-up consent   → Yes — happy to chat
Additional comments → …
```

Web3Forms free tier: **250 submissions / month**. See [web3forms.com/pricing](https://web3forms.com/pricing) for higher volumes.

---

## 📄 License

MIT — free to use, fork, and adapt.

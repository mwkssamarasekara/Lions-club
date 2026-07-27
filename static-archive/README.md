# 🦁 Lions Diamond Homagama — Official Website

A premium, modern website for **Lions Diamond Homagama** — a branch of Lions Clubs International, dedicated to community service in the Homagama region, Sri Lanka.

## 🌟 Features

### Public Website
- **Home** — Hero section with animated particles, stats counters, recent projects
- **About** — Club history, Lions International info, leadership team (dynamic from Firestore)
- **Projects** — Filterable project cards (Upcoming/Completed) from Firestore
- **Donate** — Donation form with quick-amount buttons, submits to Firestore
- **Join** — Membership application form, submits to Firestore
- **Gallery** — Filterable image gallery with lightbox, loaded from Firestore
- **Contact** — Contact form (saves to Firestore), Google Maps embed

### Admin Dashboard
- **Login** — Firebase Authentication (email/password)
- **Dashboard** — Summary cards, quick actions, recent activity
- **Members** — CRUD management for club members
- **Join Requests** — Review, approve/reject membership applications
- **Donations** — View and manage donation records
- **Gallery** — Upload (via URL) and manage gallery images

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling (custom design system) |
| JavaScript (ES Modules) | Logic & interactivity |
| Firebase Firestore | Database |
| Firebase Auth | Authentication |
| Firebase Hosting | Deployment |
| Font Awesome 6 | Icons |
| AOS Library | Scroll animations |

## 🎨 Design System

- **Colors**: Navy Blue (`#1a3a6b`), Amber Gold (`#f59e0b`), Vivid Purple (`#7c3aed`)
- **Typography**: Helvetica Neue
- **Effects**: Glassmorphism, gradients, micro-animations, parallax particles

## 📁 Project Structure

```
lions-diamond-homagama/
├── index.html              # Home page
├── about.html              # About page
├── projects.html           # Projects page
├── donate.html             # Donation page
├── join.html               # Join/membership page
├── gallery.html            # Photo gallery
├── contact.html            # Contact page
├── dashboard/
│   ├── login.html          # Admin login
│   ├── index.html          # Dashboard home
│   ├── members.html        # Members management
│   ├── join-requests.html  # Join request review
│   ├── donations.html      # Donations management
│   └── gallery.html        # Gallery management
├── css/
│   └── style.css           # Design system & styles
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── auth.js             # Authentication module
│   └── firestore-db.js     # Firestore CRUD operations
├── assets/
│   ├── img/
│   │   ├── logo.png
│   │   └── hero-bg.jpg
│   └── fonts/
├── .firebaserc
├── firebase.json
└── README.md
```

## 🚀 Deployment

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

## 🔑 Admin Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Authentication** → **Sign-in method** → Enable **Email/Password**
3. Go to **Authentication** → **Users** → **Add User**
4. Enter admin email and password
5. Use these credentials to log into the dashboard

## 📊 Firestore Collections

| Collection | Purpose |
|---|---|
| `members` | Club member records |
| `events` | Projects and events |
| `gallery` | Gallery images |
| `joinRequests` | Membership applications |
| `donations` | Donation records |
| `settings` | Site configuration |
| `contactMessages` | Contact form submissions |

---

**Made with ❤️ by Lions Diamond Homagama**

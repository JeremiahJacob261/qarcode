# QARCODE - QR Code & Barcode Scanner App

A modern, mobile-first web application for scanning and generating QR codes and barcodes.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 20+

### Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Vite dev server**:
   ```bash
   cd /home/jerry/project/qarcode
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

## Routing System

The app uses Vite with a multi-page directory structure. Instead of accessing `.html` files directly, you use clean routes:

- `/` - Splash screen
- `/home/` - Home page (main dashboard)
- `/scan/` - QR code scanner
- `/generate/` - Generate QR codes / barcodes
- `/history/` - Scan history
- `/result/` - Scan result page
- `/onboarding/` - Onboarding flow

## Project Structure

```
qarcode/
├── vite.config.ts         # Vite multi-page route configuration
├── package.json           # Scripts and dev dependencies
├── navigation.js          # Navigation & animation logic
├── animations.css         # Global animation styles
├── index.html            # Splash screen
├── home/index.html       # Home page
├── scan/index.html       # Scanner page
├── generate/index.html   # Generator page
├── generate.css          # Generator styles
├── history/index.html    # History page
├── result/index.html     # Result page
├── onboarding/index.html # Onboarding page
├── onboarding.css        # Onboarding styles
├── style.css             # Home page styles
└── Qarcode/              # Subdirectory (assets/resources)
```

## Features

- **Fast QR/Barcode Scanning**: Real-time camera-based scanning
- **Code Generation**: Create QR codes and barcodes from text/URLs
- **Scan History**: View and manage your scan history
- **Smooth Animations**: Elegant page transitions with directional slide animations
- **Mobile Optimized**: Responsive design for mobile-first experience

## Development

### Navigation
All navigation is handled by `navigation.js` using clean directory routes. Page transitions include smooth slide animations.

### Styling
- Global animations: `animations.css`
- Page-specific styles are defined in their respective CSS files
- All pages use a consistent color scheme

## Vite Configuration

Vite is configured to:
- Listen on `http://localhost:3000` during development
- Build every page as a separate HTML entry
- Serve shared static assets from the project root
- Preserve clean routes through directory-based pages

To modify the available pages, update `vite.config.ts` and the route targets in `navigation.js`.

# QARCODE - QR Code & Barcode Scanner App

A modern, mobile-first web application for scanning and generating QR codes and barcodes.

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (Fast JavaScript runtime)

### Installation & Running

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Start the routing server**:
   ```bash
   cd /home/jerry/project/qarcode
   bun run server.ts
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

## Routing System

The app uses a Bun-powered routing system. Instead of accessing `.html` files directly, you use clean routes:

- `/` - Splash screen
- `/home` - Home page (main dashboard)
- `/scan` - QR code scanner
- `/generate` - Generate QR codes / barcodes
- `/history` - Scan history
- `/result` - Scan result page
- `/onboarding` - Onboarding flow

## Project Structure

```
qarcode/
├── server.ts              # Bun routing server
├── navigation.js          # Navigation & animation logic
├── animations.css         # Global animation styles
├── index.html            # Splash screen
├── home.html             # Home page
├── scan.html             # Scanner page
├── generate.html         # Generator page
├── generate.css          # Generator styles
├── history.html          # History page
├── result.html           # Result page
├── onboarding.html       # Onboarding page
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
All navigation is handled by `navigation.js` which uses the route system defined in `server.ts`. Page transitions include smooth slide animations.

### Styling
- Global animations: `animations.css`
- Page-specific styles are defined in their respective CSS files
- All pages use a consistent color scheme

## Server Configuration

The Bun server is configured to:
- Listen on `http://localhost:3000`
- Route requests to corresponding HTML files
- Serve static assets (CSS, JS, images)
- Handle all page navigation through the routing system

To modify the routes, edit the `routes` object in `server.ts`.

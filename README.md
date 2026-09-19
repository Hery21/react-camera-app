# React Camera App

A small React + Vite app that lets you use your webcam to take a photo and detect QR codes from the live camera stream. It is designed as a simple interactive demo for camera access, image capture, and QR-based message lookup.

## What this project does

- Opens the device camera using the browser MediaDevices API
- Displays the live camera feed in the app
- Lets the user capture a still photo from the video stream
- Scans the live camera feed for QR codes
- Resolves detected QR values to friendly text responses
- Shows a modal popup when a valid QR code is detected
- Prevents repeated QR detections while a photo or result popup is active

## Features

- Camera access and stream handling
- Photo capture with canvas rendering
- QR code detection using jsQR
- Friendly result mapping for known QR content
- Responsive, single-page UI built with React
- Automated browser-based tests with Vitest and React Testing Library

## Tech stack

- React 19
- Vite
- JavaScript
- jsQR for QR decoding
- Vitest + jsdom + RTL for testing

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- npm or another package manager installed
- A browser that supports camera access, such as Chrome, Edge, or Firefox
- Permission to allow webcam access when the app starts

## Setup

1. Clone the repository
2. Open the project folder
3. Install dependencies:

```bash
npm install
```

## Run the app

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

- http://localhost:5173

> Allow camera permissions in the browser when prompted. The app cannot access the webcam without permission.

## How to use the app

1. Open the app in your browser.
2. Grant webcam permission to the site.
3. The camera feed should appear live on the page.
4. Click the capture button to take a photo.
5. The app stores the captured image in a preview area.
6. Point the camera at a QR code to trigger detection.
7. If the QR value matches a configured message, a popup will display the mapped result.

## Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

## Project structure

```text
src/
  App.jsx
  components/
  constants/
  hooks/
  utils/
  setupTests.js
```

- App.jsx: main app flow and state orchestration
- components/: UI for the camera, photo preview, and QR popup
- hooks/: reusable logic for camera and QR scanning
- utils/: QR decoding and message resolution helpers
- constants/: camera settings and known QR messages

## Notes

- Camera access only works in a secure or local browser environment and requires user permission.
- QR scanning is paused while a photo is active or while the popup is open, to avoid repeated detections.
- If the browser does not support the camera API, the app will show an error state instead of crashing.

## License

This project is intended for local development and demonstration purposes.

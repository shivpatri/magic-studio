# Project Structure Explanation

This document breaks down the anatomy of your Next.js application, explaining the purpose of every folder and file you see in your project directory. We'll start with the high-level directories, move into the configuration files, and finally take a deep dive into the source code (`src`) where the actual application lives.

---

## 📁 Root Directories

### `node_modules/`
This is where all your project's third-party dependencies and libraries live. When you ran `npm install`, tools like React, Next.js, Tailwind CSS, and `react-image-crop` were downloaded into this folder. 
> [!NOTE]
> You should **never** edit files inside `node_modules` directly, and this folder is excluded from version control (Git) because it is massive and can be recreated at any time by running `npm install`.

### `public/`
This folder is used to serve static assets like images, SVGs, fonts, or a `favicon.ico`. Any file placed here can be accessed directly from the root URL of your website (e.g., `public/logo.svg` is accessible at `yoursite.com/logo.svg`).

### `.next/` (Hidden Folder)
This is the build folder generated automatically by Next.js when you run `npm run dev` or `npm run build`. It contains compiled code, optimized images, and cached data to make your application run blazingly fast. Like `node_modules`, you don't touch this folder directly.

### `src/` (Source)
This is the heart of your application. All the custom code you write goes inside here. It is divided into subdirectories to keep things organized (explained in detail below).

---

## ⚙️ Configuration Files (Miscellaneous)

These files sitting at the root of your project tell the various tools in your stack how to behave.

- **`package.json`**: The most important config file. It holds your project's metadata (name, version), the list of dependencies (and their exact versions) your project needs to run, and the "scripts" you can run in your terminal (like `npm run dev` or `npm run build`).
- **`package-lock.json`**: An automatically generated file that locks the exact, specific versions of every dependency (and their sub-dependencies) to ensure that if someone else clones your project, they get the exact same setup and nothing breaks.
- **`next.config.ts`**: The configuration file for the Next.js framework itself. You use this to tweak how Next.js builds your app, set up redirects, or configure image optimization domains.
- **`tsconfig.json`**: The configuration file for **TypeScript**. It tells the TypeScript compiler how strict it should be when checking your code for errors and how it should compile your TypeScript into regular JavaScript.
- **`eslint.config.mjs`**: The configuration file for **ESLint**, a tool that automatically scans your code for syntax errors, bad practices, or formatting issues and yells at you (or fixes them) before you run the code.
- **`postcss.config.mjs`**: Configuration for PostCSS, a tool that transforms your CSS. In modern Next.js projects, this is primarily used to wire up Tailwind CSS so it can scan your files and generate only the CSS you actually use.
- **`next-env.d.ts`**: An automatically generated file that ensures the TypeScript compiler knows about Next.js specific types. You can ignore this file.
- **`AGENTS.md` / Markdown Files**: Custom instructions and context for AI coding agents to follow when working in this specific repository.

---

## 🧠 Deep Dive: The `src` Directory

The `src` folder is where the magic happens. Here is how the four folders inside it work together.

### 1. `src/hooks/`
**Status:** Empty
**Purpose:** In React, "Hooks" are reusable functions that manage state or side-effects (like fetching data or listening to window resizing). If we needed a custom hook, like `useWindowSize()`, we would put it here. We didn't need any custom hooks for this specific app, so it's currently empty.

### 2. `src/lib/`
**Purpose:** This folder holds utility functions, constants, and helper logic that aren't React components themselves, but are used *by* the components. Keeping this logic separate makes the components cleaner.

- **`cropUtils.ts` (Crucial)**: 
  This file contains the core "brain" of the app. It holds two main functions:
  1. `calculateAICrop()`: This is the math function. It looks at the width and height of an uploaded image and calculates exactly where a 3:4 rectangle should be placed in the upper-center third of the photo to frame a face perfectly.
  2. `exportCroppedImage()`: This takes the original image and the user's selected crop coordinates, spins up an invisible HTML `<canvas>`, draws only the cropped portion onto it, and triggers a browser download.

### 3. `src/components/`
**Purpose:** This folder holds isolated, reusable UI building blocks (React Components). They are like Lego pieces that we assemble in the main app.

- **`PhotoUpload.tsx` (Crucial)**:
  Handles the very first step of the user journey. It renders the drag-and-drop zone. It uses the `react-dropzone` library to intercept files dragged onto the screen, checks if they are valid images under 10MB, and converts the physical file into a string of data (a Data URL) that the browser can display.
- **`CropEditor.tsx` (Crucial)**:
  Handles the second step. Once an image is uploaded, this component takes over. It displays the image and overlays the interactive cropping box using the `react-image-crop` library. It contains the buttons to change the aspect ratio, reset the AI suggestion, and trigger the final export.

### 4. `src/app/`
**Purpose:** This folder uses Next.js's "App Router". The structure of folders inside `src/app/` directly dictates the URLs of your website.

- **`globals.css`**: The global stylesheet. This is where we import Tailwind CSS, define our custom color palette (using CSS variables), and set up the default typography for the entire application.
- **`layout.tsx` (Crucial)**: 
  This is the "wrapper" for your entire application. The HTML `<html>` and `<body>` tags live here. 
  - It loads the global `Inter` font.
  - It sets up the `<Toaster />` component, which is a global listener that allows us to pop up success/error notification "toasts" from anywhere in the app.
  - Whatever page the user visits is injected into the `{children}` slot of this layout.
- **`page.tsx` (Crucial)**:
  This is the homepage (`/` URL) of your application. Think of it as the **Traffic Controller**.
  - It holds the "State" (memory) of the application, specifically: *Does the user currently have an image selected?*
  - If no image is selected, it renders the `<PhotoUpload />` component.
  - If an image *is* selected, it hides the upload component and renders the `<CropEditor />` component instead, passing the selected image data down to it.

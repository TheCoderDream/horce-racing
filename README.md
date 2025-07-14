# Horse Racing Game

**Live Demo:** [https://insider-horse-racing.netlify.app/](https://insider-horse-racing.netlify.app/)

A modern, interactive horse racing simulation built with Vue 3 and Vite. This project demonstrates component-based architecture, state management with Vuex, and modern testing practices using Vitest and Playwright.

## Table of Contents

- [About](#about)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## About

This app simulates a horse racing event, allowing users to view race schedules, track horse progress in real time, and interact with a visually engaging race track. It is designed as a front-end case study to showcase best practices in Vue 3 development, modular design, and automated testing.

---

## Project Structure

```
horse-racing-game/
├── public/                # Static assets (e.g., icons)
├── src/
│   ├── assets/            # Images and SVGs
│   ├── __tests__/         # Unit tests
│   ├── e2e/               # e2e tests
│   ├── components/        # Reusable Vue components
│   │   └── race-track/    # Race track and horse display components
│   ├── constants/         # App-wide constants
│   ├── layouts/           # Layout components (e.g., MainLayout)
│   ├── store/             # Vuex store for state management
│   ├── utils/             # Utility functions
│   ├── views/             # Main app views/pages (e.g., HomePage)
│   ├── style.css          # Global styles
│   └── main.ts            # App entry point
├── package.json           # Project metadata and scripts
├── vite.config.js         # Vite configuration
├── vitest.config.ts       # Vitest configuration
├── playwright.config.ts   # Playwright configuration
└── README.md              # Project documentation
```

---

## Features

- **Live Horse Racing Simulation:** Watch horses race in real time with animated progress.
- **Race Program Schedule:** View upcoming races and horse details.
- **Component-Based UI:** Modular, reusable Vue components for easy maintenance.
- **State Management:** Centralized state using Vuex.
- **Modern Testing:** Unit and end-to-end tests with Vitest and Playwright.
- **Responsive Design:** Works well on desktop and mobile devices.

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd horse-racing-game
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

---

## Running the App

- **Development server:**
  ```sh
  npm run dev
  ```
  The app will be available at [http://localhost:5173](http://localhost:5173) (or as indicated in your terminal).

- **Production build:**
  ```sh
  npm run build
  ```

- **Preview production build:**
  ```sh
  npm run preview
  ```

---

## Testing

- **Unit tests (Vitest):**
  ```sh
  npm run test
  ```

- **End-to-end tests (Playwright):**
  ```sh
  npm run test:e2e
  ```

---

## Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vitejs.dev/) (Fast build tool)
- [Vuex](https://vuex.vuejs.org/) (State management)
- [Vitest](https://vitest.dev/) (Unit testing)
- [Playwright](https://playwright.dev/) (E2E testing)
- [TypeScript](https://www.typescriptlang.org/) (Type safety)

---

## License

This project is for educational and demonstration purposes.

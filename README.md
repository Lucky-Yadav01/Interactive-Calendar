# Office Interactive Calendar and Employee Management System

Frontend-only office system built with React and Vite.
It includes role-based access, employee and department management, calendar events, announcements, and notifications.
All data is persisted in browser localStorage.

## Tech Stack

- React
- Vite
- React Router
- FullCalendar
- LocalStorage (client-side persistence)

## Features

- Role-based login (Admin and Staff)
- Dashboard overview
- Employee management
- Department management
- Interactive calendar (month/week/day)
- Event create, edit, and delete (admin controls)
- Event colors by type
- Announcements and notifications
- Staff visibility rules by department and broadcast targeting
- Responsive mobile-first UI

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Modern browser (Chrome, Edge, Firefox)

## Setup Instructions

1. Clone or download this repository.
2. Open a terminal in the project root.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app in your browser:

```text
http://localhost:5173
```

If port 5173 is already in use, run:

```bash
npm run dev -- --port 5174
```

## Demo Credentials

- Admin Email: admin@office.local
- Admin Password: admin123

Staff users can be created and managed by Admin from the Employees section.

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Data Persistence and Reset

- This project is frontend-only and stores data in browser localStorage.
- Data remains available after refresh in the same browser/profile.
- To reset the app data, clear localStorage/site data from browser developer tools.

## Demo Access

- Local demo: http://localhost:5173
- Public hosted demo: Not available in this submission (run locally using setup steps above)

## Assignment Submission Checklist

Include the following in your submission:

1. Source code (zip file or repository link)
2. Setup instructions (this README)
3. Screenshots of key modules
4. Demo access note (local run steps and credentials)
5. Developer documentation: SYSTEM_GUIDE.md

## Useful Scripts

```bash
npm run dev      # Start dev server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

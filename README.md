# Frontend Documentation

This directory contains the frontend code for our CSE-3311 Software Engineering project. The frontend provides the user interface and client-side functionality for our Budget Buddy application.

## Overview

The frontend is built using Next.js to provide a responsive and intuitive user experience. This part of the project handles all user interactions, data presentation, and client-side processing.

## Technologies Used

- **Framework**: Next.js
- **UI Libraries**: Tailwind CSS
- **State Management**:
- **Testing Tools**: React Testing Library
- **TypeScript**: For type safety and better development experience

## Getting Started

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm (v9.x or higher) or Yarn

### Installation

1. Clone the repository

   ```bash
   git clone git@github.com:zaineel/frontend.git
   ```

2. Navigate to the frontend directory

   ```bash
   cd frontend
   ```

3. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
frontend/
├── public/          # Static files
├── src/             # Source code
│   ├── app/         # Next.js app router components
│   ├── components/  # Reusable UI components
│   ├── lib/         # Utility functions
│   ├── services/    # API services
│   └── types/       # TypeScript type definitions
├── .env.local       # Environment variables
└── package.json     # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm start` - Runs the production build
- `npm run lint` - Lints the codebase

## Contributing

1. Make sure to follow the established coding standards
2. Write and update tests as necessary
3. Update documentation for any changes to the API or functionality

## Connect with Backend

The frontend connects to the ASP.NET Core 9 backend services. The backend handles data processing, authentication, and business logic. See the main README for more information about how the entire system works together.

## Live Website

The application is deployed and accessible at: https://budgetbuddy.zaineelmithani.com/

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Contact

For questions or issues related to the frontend, please create github issues.

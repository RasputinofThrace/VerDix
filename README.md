# VerDix

A sustainability-focused app for product analysis using AI.

## Features

- Scan products for eco-friendliness
- Get sustainability tips
- Carbon calculator
- Alternative product finder

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Google Gemini AI

## Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/immansha/verdix.git
   cd verdix
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:

   For backend, create `backend/.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=5001
   ```

   For frontend, create `frontend/.env` (optional, defaults to localhost):
   ```
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

### Running Locally

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

1. Build the backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

## Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render

Update `VITE_API_BASE_URL` in Vercel environment variables to point to the Render backend URL.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

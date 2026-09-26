# SlotSwapper – Peer-to-Peer Time Slot Scheduling

SlotSwapper is a full-stack web application that allows users to exchange busy calendar slots with each other. Users can mark their own events as "swappable", browse other users' swappable slots, and propose swaps. When a swap is accepted, the ownership of the two events is exchanged, and the calendars are updated accordingly.

## 🚀 Features Implemented

### Core Functionality
- **User Authentication**  
  - Sign up with name, email, and password  
  - Log in with email and password  
  - JWT-based authentication (Bearer token)  
  - Protected routes on both frontend and backend

- **Calendar / Event Management**
  - Users can create, read, update, and delete their own events  
  - Each event has: title, startTime, endTime, status (BUSY, SWAPPABLE, SWAP_PENDING), and owner  
  - Users can change an event's status (e.g., mark as SWAPPABLE)

- **Marketplace for Swappable Slots**
  - View all swappable slots from other users (excludes own slots)  
  - Request a swap by selecting one of your own swappable slots as an offer

- **Swap Request Workflow**
  - Create a swap request (`PENDING` status)  
  - Both involved slots are set to `SWAP_PENDING` to prevent double-booking  
  - Requestee can **Accept** or **Reject** the swap  
    - **Reject**: request status → `REJECTED`, both slots revert to `SWAPPABLE`  
    - **Accept**: request status → `ACCEPTED`, ownership of the two events is exchanged, and both slots become `BUSY`

- **Notifications / Requests View**
  - Incoming requests (where you are the requestee) with Accept/Reject buttons  
  - Outgoing requests (where you are the requester) with status display

- **Frontend State Management**
  - React Context API for authentication state  
  - Dynamic UI updates after swap acceptance/rejection (no manual refresh needed)  
  - Protected routes using a `ProtectedRoute` wrapper

- **Deployment**
  - Frontend deployed on **Vercel**  
  - Backend deployed on **Render**  
  - Database hosted on **MongoDB Atlas**

### Future Features 
- Real‑time notifications via WebSockets  
- Unit/Integration tests  
- Docker containerization  

## 🛠 Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Frontend       | React 19, TypeScript, Vite, React Router v7, Tailwind CSS, Axios |
| Backend        | Node.js, Express, TypeScript                    |
| Database       | MongoDB (Mongoose ODM)                          |
| Authentication | JWT (jsonwebtoken), bcryptjs                    |
| Deployment     | Vercel (frontend), Render (backend), MongoDB Atlas |

## 📁 Project Structure
```
SlotSwapper/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── contexts/ # Auth context
│ │ ├── pages/ # Page components (Login, Register, Dashboard)
│ │ ├── services/ # API service (Axios instance)
│ │ ├── types/ # TypeScript interfaces
│ │ └── App.tsx
│ ├── .env # Local environment variables
│ ├── .env.production # Production environment variables
│ ├── vercel.json # Vercel routing configuration
│ └── package.json
├── backend/ # Express backend
│ ├── src/
│ │ ├── controllers/ # Route handlers (auth, event, swap)
│ │ ├── middleware/ # JWT authentication middleware
│ │ ├── models/ # Mongoose schemas (User, Event, SwapRequest)
│ │ ├── routes/ # Express routers
│ │ ├── types/ # TypeScript type definitions
│ │ ├── utils/ # JWT helpers
│ │ └── index.ts # Entry point
│ ├── .env # Local environment variables
│ ├── .env.production # Production environment variables
│ ├── render.yaml # Render deployment configuration
│ └── package.json
└── README.md
```

text

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas connection string)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SlotSwapper.git
cd SlotSwapper
2. Backend Setup
bash
cd backend
npm install
Create a .env file in the backend folder:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper   # or your Atlas URI
JWT_SECRET=your_strong_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
Start the backend:

bash
npm run dev
The API will be available at http://localhost:5000.

3. Frontend Setup
bash
cd ../client
npm install
Create a .env file in the client folder:

env
VITE_API_URL=http://localhost:5000
Start the frontend:

bash
npm run dev
The app will open at http://localhost:5173.


🧠 Design Decisions & Assumptions
JWT for stateless authentication – simplifies scaling and avoids session storage.

MongoDB – chosen for flexible schema design and ease of integration with Mongoose.

Status transitions – slots move from BUSY → SWAPPABLE → SWAP_PENDING → BUSY (after swap) or back to SWAPPABLE (if rejected).

Preventing double‑booking – when a swap request is created, both slots are immediately set to SWAP_PENDING, so they cannot be offered in other swaps.

CORS – configured to allow the frontend origin in production.

Client‑side routing – Vercel rewrites all routes to index.html to support React Router.

Environment variables – used to separate development and production configurations.

🧪 Challenges Faced
TypeScript compilation on Render – initially failed due to @types/node being in devDependencies; moved it to dependencies to ensure it is available during production build.

CORS issues – resolved by correctly setting the CLIENT_URL environment variable and using a flexible CORS configuration.

404 on page refresh – fixed by adding a vercel.json with a catch‑all route to serve index.html.

Environment variable propagation – ensured that VITE_API_URL is set in Vercel  dashboard for production builds.

🚀 Deployment
Frontend: https://slot-swapper-woad.vercel.app

Backend: https://slotxchange-backend.onrender.com

Note: The backend is on Render free tier and may spin down after inactivity. The first request might take a few seconds.

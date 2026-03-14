# Hospital Management System (HMS)

A comprehensive web-based platform to automate hospital operations including patient records, appointment scheduling, billing, and staff management.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
hospital-management-system/
├── client/          # React.js frontend
├── server/          # Node.js/Express backend
└── README.md
```

## User Roles

1. **Admin** - Full system access, staff management, reports
2. **Doctor** - Manage appointments, update patient medical history
3. **Staff/Receptionist** - Patient registration, appointment booking, billing
4. **Patient** - View profile, medical history, book appointments

## Key Features

- Patient Management
- Appointment Scheduling
- Doctor & Staff Management
- Billing & Report Generation
- Role-Based Access Control

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. Start MongoDB service
2. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

## License

MIT

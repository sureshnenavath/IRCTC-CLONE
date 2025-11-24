# IRCTC Train Booking Simulation

A full-stack train ticket booking system simulating IRCTC core functionalities.

## Features

### User Features
- User Signup/Login with authentication
- User Profile management
- Add payment methods (Debit/Credit/UPI)
- Save Passenger Master list
- Search trains by source, destination, and date
- Check seat availability (Class & Quota)
- Add passenger details (Name, Age, Gender, Berth Preference)
- Mock payment gateway
- Booking confirmation and cancellation

### Admin Features
- Add and manage train routes

## Tech Stack

**Frontend:** React.js  
**Backend:** Node.js, Express.js  
**Storage:** JSON-based data storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd IRCTC-Sim
```

### 2. Setup Backend (Server)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
node index.js
```

The backend server will run on **http://localhost:5000**

### 3. Setup Frontend (Client)

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend application will run on **http://localhost:3000**

## Running the Application

1. **Start Backend Server** (Terminal 1):
   ```bash
   cd server
   node index.js
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to **http://localhost:3000**

## Project Structure

```
IRCTC-Sim/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context API for state management
│   │   ├── pages/          # Application pages
│   │   └── App.js
│   └── package.json
│
└── server/                 # Node.js backend
    ├── db.json            # JSON database
    ├── index.js           # Server entry point
    └── package.json
```

## API Endpoints

The backend provides RESTful APIs for:
- User authentication
- Profile management
- Train search and availability
- Booking operations
- Admin train management

## Default Ports

- **Frontend:** 3000
- **Backend:** 5000

## Notes

- Data is stored locally in `db.json` file
- Payment gateway is simulated (no real transactions)
- Make sure both frontend and backend are running simultaneously for full functionality

## Support

For any issues or questions, please contact the development team.

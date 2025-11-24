const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return { users: [], trains: [], bookings: [], passengers: [] };
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (error) {
        console.error("Error reading DB:", error);
        return { users: [], trains: [], bookings: [], passengers: [] };
    }
};

app.get('/', (req, res) => {
    res.send('API Running');
});

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    const db = readDB();
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user',
        wallet: 10000, // Default wallet balance for simulation
        savedPassengers: []
    };
    db.users.push(newUser);
    writeDB(db);
    res.json({ success: true, user: newUser });
});

// --- Trains ---
app.get('/api/trains', (req, res) => {
    const { source, destination } = req.query;
    const db = readDB();
    let trains = db.trains;

    if (source && destination) {
        trains = trains.filter(t =>
            t.source.toLowerCase().includes(source.toLowerCase()) &&
            t.destination.toLowerCase().includes(destination.toLowerCase())
        );
    }
    res.json(trains);
});

app.post('/api/trains', (req, res) => {
    const { name, source, destination, departureTime, arrivalTime, classes, days } = req.body;
    const db = readDB();
    const newTrain = {
        id: Date.now(),
        name,
        source,
        destination,
        departureTime,
        arrivalTime,
        classes,
        days
    };
    db.trains.push(newTrain);
    writeDB(db);
    res.json({ success: true, train: newTrain });
});

// --- Bookings ---
app.post('/api/bookings', (req, res) => {
    const { userId, trainId, date, passengerDetails, totalAmount } = req.body;
    const db = readDB();

    // Payment Simulation (If/Else as requested)
    if (totalAmount > 0) {
        // Assume payment success
        const newBooking = {
            id: Date.now(),
            userId,
            trainId,
            date,
            passengerDetails,
            totalAmount,
            status: 'Booked',
            bookingDate: new Date().toISOString()
        };
        db.bookings.push(newBooking);
        writeDB(db);
        res.json({ success: true, booking: newBooking });
    } else {
        res.status(400).json({ success: false, message: 'Invalid amount' });
    }
});

app.get('/api/bookings/:userId', (req, res) => {
    const { userId } = req.params;
    const db = readDB();
    const userBookings = db.bookings.filter(b => b.userId == userId);
    // Enrich with train details
    const enriched = userBookings.map(b => {
        const train = db.trains.find(t => t.id == b.trainId);
        return { ...b, trainName: train ? train.name : 'Unknown Train' };
    });
    res.json(enriched);
});

// --- Passengers ---
app.post('/api/passengers', (req, res) => {
    const { userId, passenger } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id == userId);
    if (userIndex !== -1) {
        if (!db.users[userIndex].savedPassengers) db.users[userIndex].savedPassengers = [];
        db.users[userIndex].savedPassengers.push(passenger);
        writeDB(db);
        res.json({ success: true, passengers: db.users[userIndex].savedPassengers });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.get('/api/passengers/:userId', (req, res) => {
    const { userId } = req.params;
    const db = readDB();
    const user = db.users.find(u => u.id == userId);
    res.json(user ? (user.savedPassengers || []) : []);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

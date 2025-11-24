import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [newPassenger, setNewPassenger] = useState({ name: '', age: '', gender: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect admin users away from dashboard
        if (user && user.role === 'admin') {
            navigate('/admin');
            return;
        }
        
        if (user) {
            fetchBookings();
            fetchPassengers();
        }
    }, [user, navigate]);

    const fetchBookings = async () => {
        const res = await fetch(`http://localhost:5000/api/bookings/${user.id}`);
        const data = await res.json();
        setBookings(data);
    };

    const fetchPassengers = async () => {
        const res = await fetch(`http://localhost:5000/api/passengers/${user.id}`);
        const data = await res.json();
        setPassengers(data);
    };

    const handleAddPassenger = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/passengers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, passenger: newPassenger }),
        });
        const data = await res.json();
        if (data.success) {
            setPassengers(data.passengers);
            setNewPassenger({ name: '', age: '', gender: '' });
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <h2 className="page-title" style={{ marginBottom: '5px' }}>Dashboard</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    My Bookings
                </button>
                <button
                    className={`tab-btn ${activeTab === 'passengers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('passengers')}
                >
                    Saved Passengers
                </button>
            </div>

            {activeTab === 'bookings' && (
                <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>Booking History</h3>
                    {bookings.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No bookings found. <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/')}>Book a ticket now!</span></p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Train</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.trainName}</td>
                                        <td>{booking.date}</td>
                                        <td>
                                            <span className={`status-badge ${booking.status === 'Booked' ? 'status-booked' : 'status-cancelled'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>₹{booking.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === 'passengers' && (
                <div className="grid">
                    <div className="card">
                        <h3 style={{ marginBottom: '20px' }}>Add Passenger</h3>
                        <form onSubmit={handleAddPassenger}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="input-field"
                                    value={newPassenger.name}
                                    onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="Age"
                                    className="input-field"
                                    value={newPassenger.age}
                                    onChange={(e) => setNewPassenger({ ...newPassenger, age: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <select
                                    className="input-field"
                                    value={newPassenger.gender}
                                    onChange={(e) => setNewPassenger({ ...newPassenger, gender: e.target.value })}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Passenger</button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '20px' }}>Saved List</h3>
                        {passengers.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No saved passengers.</p>
                        ) : (
                            <ul className="passenger-list">
                                {passengers.map((p, idx) => (
                                    <li key={idx} className="passenger-item">
                                        <span>{p.name}</span>
                                        <span className="passenger-details">{p.age}, {p.gender}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

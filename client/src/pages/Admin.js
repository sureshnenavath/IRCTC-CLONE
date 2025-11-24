import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [train, setTrain] = useState({
        name: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        days: [],
        classes: []
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleAddTrain = async (e) => {
        e.preventDefault();
        const payload = {
            ...train,
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            classes: [
                { type: '1A', price: 2000, seats: 50 },
                { type: '2A', price: 1500, seats: 100 },
                { type: 'SL', price: 500, seats: 200 }
            ]
        };

        const res = await fetch('http://localhost:5000/api/trains', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
            alert('Train Added Successfully');
            setTrain({ name: '', source: '', destination: '', departureTime: '', arrivalTime: '', days: [], classes: [] });
        }
    };

    return (
        <div className="container">
            <h2 className="page-title">Admin Panel</h2>
            <div className="card admin-container">
                <h3>Add New Train</h3>
                <form onSubmit={handleAddTrain}>
                    <div className="input-group">
                        <label className="auth-label">Train Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={train.name}
                            onChange={(e) => setTrain({ ...train, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="auth-label">Source</label>
                        <input
                            type="text"
                            className="input-field"
                            value={train.source}
                            onChange={(e) => setTrain({ ...train, source: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="auth-label">Destination</label>
                        <input
                            type="text"
                            className="input-field"
                            value={train.destination}
                            onChange={(e) => setTrain({ ...train, destination: e.target.value })}
                            required
                        />
                    </div>
                    <div className="admin-form-row">
                        <div className="input-group admin-form-col">
                            <label className="auth-label">Departure</label>
                            <input
                                type="time"
                                className="input-field"
                                value={train.departureTime}
                                onChange={(e) => setTrain({ ...train, departureTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group admin-form-col">
                            <label className="auth-label">Arrival</label>
                            <input
                                type="time"
                                className="input-field"
                                value={train.arrivalTime}
                                onChange={(e) => setTrain({ ...train, arrivalTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary add-train-btn">Add Train</button>
                </form>
            </div>
        </div>
    );
};

export default Admin;

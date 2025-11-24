import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar container">
            <Link to="/" className="logo">Train Booking System</Link>
            <div className="nav-links">
                {(!user || user.role !== 'admin') && (
                    <Link to="/" className="nav-link">Home</Link>
                )}
                {user ? (
                    <>
                        {user.role !== 'admin' && (
                            <>
                                <Link to="/dashboard" className="nav-link">My Bookings</Link>
                                <Link to="/profile" className="btn-nav btn-profile">Profile</Link>
                            </>
                        )}

                        {user.role === 'admin' && (
                            <Link to="/admin" className="btn-nav btn-admin">Admin Panel</Link>
                        )}

                        <button onClick={handleLogout} className="btn btn-secondary logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

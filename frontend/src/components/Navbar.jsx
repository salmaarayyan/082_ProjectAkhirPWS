import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiFilm, FiList, FiUser, FiUsers, FiTrendingUp, FiLogOut } from 'react-icons/fi';
import { authAPI } from '../services/api';
import LogoutModal from './LogoutModal';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const isActive = (path) => location.pathname === path;

    // User menu items
    const userMenuItems = [
        { path: '/user/dashboard', label: 'Dashboard', icon: FiHome },
        { path: '/user/browse', label: 'Browse', icon: FiFilm },
        { path: '/user/watchlist', label: 'Watchlist', icon: FiList },
        { path: '/user/profile', label: 'Profile', icon: FiUser }
    ];

    // Admin menu items
    const adminMenuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
        { path: '/admin/users', label: 'Users', icon: FiUsers },
        { path: '/admin/popular', label: 'Popular', icon: FiTrendingUp },
        { path: '/admin/profile', label: 'Profile', icon: FiUser }
    ];

    const menuItems = user.role === 'admin' ? adminMenuItems : userMenuItems;

    return (
        <>
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
                        <img src="/PWS.png" alt="Logo" className="navbar-logo" />
                        Movie Watchlist
                    </Link>
                </div>

                <div className="navbar-menu">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`navbar-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="navbar-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="navbar-end">
                    <div className="navbar-user-avatar">
                        {user.profile_photo ? (
                            <img src={user.profile_photo} alt="Profile" />
                        ) : (
                            <span>{user.username?.charAt(0).toUpperCase() || '?'}</span>
                        )}
                    </div>
                    <span className="navbar-user">
                        {user.username}
                    </span>
                    <button onClick={() => setShowLogoutModal(true)} className="btn-logout">
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;

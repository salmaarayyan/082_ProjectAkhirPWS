import React, { useState, useEffect } from 'react';
import { FiUsers, FiList, FiCheckCircle, FiActivity, FiRefreshCw, FiMail, FiClock } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const [statsRes, logsRes] = await Promise.all([
                adminAPI.getDashboard(),
                adminAPI.getActivityLogs(15)
            ]);
            setStats(statsRes.data);
            setActivityLogs(logsRes.data.logs || []);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const logsRes = await adminAPI.getActivityLogs(15);
            setActivityLogs(logsRes.data.logs || []);
        } catch (err) {
            console.error('Failed to refresh:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'LOGIN': return '🔑';
            case 'ADD_WATCHLIST': return '➕';
            case 'REMOVE_WATCHLIST': return '🗑️';
            case 'WATCHED': return '✅';
            case 'LOGOUT': return '🚪';
            default: return '📝';
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now - date) / 1000;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const formatLastLogin = () => {
        const now = new Date();
        return now.toLocaleDateString('id-ID') + ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-container">
                    <div className="loading">Loading...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                </div>

                {/* Top Section: Stats + Admin Info */}
                <div className="dashboard-top">
                    <div className="stats-section" style={{ flex: 1 }}>
                        {/* Row 1: Saved Movies + Watched */}
                        <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FiList />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Saved Movies</h3>
                                    <div className="stat-value">{stats?.totalWatchlistItems || 0}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon icon-success">
                                    <FiCheckCircle />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Watched</h3>
                                    <div className="stat-value">{stats?.totalWatched || 0}</div>
                                </div>
                            </div>
                        </div>
                        {/* Row 2: Total Users */}
                        <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FiUsers />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Users</h3>
                                    <div className="stat-value">{stats?.totalUsers || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Info Card */}
                    <div className="admin-info-card">
                        <h3>Info Admin</h3>
                        <div className="admin-info-divider"></div>
                        <div className="admin-info-item">
                            <span className="admin-info-label"><FiMail /> EMAIL</span>
                            <span className="admin-info-value">{user.email || 'admin@example.com'}</span>
                        </div>
                        <div className="admin-info-item">
                            <span className="admin-info-label"><FiClock /> LOGIN TERAKHIR</span>
                            <span className="admin-info-value">{formatLastLogin()}</span>
                        </div>
                    </div>
                </div>

                {/* Activity Logs Section */}
                <div className="section">
                    <div className="section-header">
                        <h2><FiActivity style={{ marginRight: '8px' }} /> Recent Activity</h2>
                        <button
                            className="btn-refresh"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <FiRefreshCw className={refreshing ? 'spin' : ''} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                    <div className="activity-card">
                        {activityLogs.length > 0 ? (
                            <div className="activity-list">
                                {activityLogs.map((log) => (
                                    <div key={log.id} className="activity-item">
                                        <div className="activity-avatar">
                                            {log.user?.profile_photo ? (
                                                <img src={log.user.profile_photo} alt="User" />
                                            ) : (
                                                <span>{log.user?.username?.charAt(0).toUpperCase() || '?'}</span>
                                            )}
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-text">
                                                <span className="activity-icon">{getActionIcon(log.action)}</span>
                                                <strong>{log.user?.username || 'Unknown'}</strong>
                                                <span className="activity-details">{log.details}</span>
                                            </div>
                                            <span className="activity-time">{formatTime(log.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;

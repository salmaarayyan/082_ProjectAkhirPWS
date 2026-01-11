import React, { useState, useEffect } from 'react';
import { FiFilm, FiList, FiCheckCircle } from 'react-icons/fi';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import './Dashboard.css';

const UserDashboard = () => {
    const [stats, setStats] = useState({ totalMovies: 0, watchlist: 0, watched: 0 });
    const [recentMovies, setRecentMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, watchlistRes] = await Promise.all([
                userAPI.getStats(),
                userAPI.getWatchlist({ limit: 8 })
            ]);
            setStats(statsRes.data);
            setRecentMovies(watchlistRes.data.watchlist);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
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
                    <h1>Dashboard</h1>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FiFilm />
                        </div>
                        <div className="stat-content">
                            <h3>Total Movies</h3>
                            <div className="stat-value">{stats.totalMovies}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FiList />
                        </div>
                        <div className="stat-content">
                            <h3>In Watchlist</h3>
                            <div className="stat-value">{stats.watchlist}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon icon-success">
                            <FiCheckCircle />
                        </div>
                        <div className="stat-content">
                            <h3>Watched</h3>
                            <div className="stat-value">{stats.watched}</div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2>Recent in Watchlist</h2>
                    </div>
                    {recentMovies.length > 0 ? (
                        <div className="movie-grid">
                            {recentMovies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    inWatchlist={true}
                                    status={movie.status}
                                    onRemove={async (movieId) => {
                                        await userAPI.removeFromWatchlist(movieId);
                                        fetchData();
                                    }}
                                    onStatusChange={async (movieId, status) => {
                                        await userAPI.updateWatchlistStatus(movieId, status);
                                        fetchData();
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No movies in your watchlist yet. Start browsing!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;

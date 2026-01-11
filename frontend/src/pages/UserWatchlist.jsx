import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import './Dashboard.css';

const UserWatchlist = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetchWatchlist();
    }, [page, filter]);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 20 };
            if (filter !== 'all') {
                params.status = filter;
            }
            const response = await userAPI.getWatchlist(params);
            setMovies(response.data.watchlist);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Failed to load watchlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (movieId) => {
        try {
            await userAPI.removeFromWatchlist(movieId);
            fetchWatchlist();
        } catch (err) {
            console.error('Failed to remove:', err);
        }
    };

    const handleStatusChange = async (movieId, status) => {
        try {
            await userAPI.updateWatchlistStatus(movieId, status);
            fetchWatchlist();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>My Watchlist</h1>
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => { setFilter('all'); setPage(1); }}
                    >
                        All ({pagination.total || 0})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'watchlist' ? 'active' : ''}`}
                        onClick={() => { setFilter('watchlist'); setPage(1); }}
                    >
                        To Watch
                    </button>
                    <button
                        className={`filter-tab ${filter === 'watched' ? 'active' : ''}`}
                        onClick={() => { setFilter('watched'); setPage(1); }}
                    >
                        Watched
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : movies.length > 0 ? (
                    <>
                        <div className="movie-grid">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    inWatchlist={true}
                                    status={movie.status}
                                    onRemove={handleRemove}
                                    onStatusChange={handleStatusChange}
                                    onViewDetail={setSelectedMovie}
                                />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                    Previous
                                </button>
                                <span>Page {pagination.page} of {pagination.totalPages}</span>
                                <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.totalPages}>
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Your watchlist is empty. Start browsing!</p>
                    </div>
                )}
            </div>

            {/* Movie Detail Modal */}
            <MovieDetailModal
                movie={selectedMovie}
                isOpen={!!selectedMovie}
                onClose={() => setSelectedMovie(null)}
                inWatchlist={true}
            />
        </>
    );
};

export default UserWatchlist;

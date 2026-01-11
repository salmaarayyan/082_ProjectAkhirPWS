import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiLogIn } from 'react-icons/fi';
import { userAPI, publicAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoginRequiredModal from '../components/LoginRequiredModal';
import './Dashboard.css';
import './PublicMovies.css';

const PublicMovies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [watchlistIds, setWatchlistIds] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        fetchPopularMovies();
        // Check if user is logged in and fetch watchlist
        const token = localStorage.getItem('token');
        if (token) {
            fetchWatchlistIds();
        }
    }, []);

    const fetchPopularMovies = async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await publicAPI.getPopularMovies(pageNum);
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
            setPage(pageNum);
            setIsSearching(false);
        } catch (err) {
            console.error('Failed to load movies:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWatchlistIds = async () => {
        try {
            const response = await userAPI.getWatchlist({ limit: 1000 });
            const ids = response.data.watchlist.map(m => m.movie_id);
            setWatchlistIds(ids);
        } catch (err) {
            console.error('Failed to load watchlist:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchPopularMovies();
            return;
        }

        try {
            setLoading(true);
            const response = await publicAPI.searchMovies(searchQuery, 1);
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
            setPage(1);
            setIsSearching(true);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (newPage) => {
        if (isSearching) {
            try {
                setLoading(true);
                const response = await publicAPI.searchMovies(searchQuery, newPage);
                setMovies(response.data.results);
                setPage(newPage);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setLoading(false);
            }
        } else {
            fetchPopularMovies(newPage);
        }
    };

    const handleAddToWatchlist = async (movie) => {
        const token = localStorage.getItem('token');
        
        // Check if user is logged in
        if (!token) {
            setShowLoginModal(true);
            return;
        }

        try {
            await userAPI.addToWatchlist({
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                overview: movie.overview
            });
            setWatchlistIds([...watchlistIds, movie.id]);
        } catch (err) {
            console.error('Failed to add:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleRemoveFromWatchlist = async (movieId) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await userAPI.removeFromWatchlist(movieId);
            setWatchlistIds(watchlistIds.filter(id => id !== movieId));
        } catch (err) {
            console.error('Failed to remove:', err);
        }
    };

    return (
        <div className="public-movies-page">
            {/* Login Required Modal */}
            <LoginRequiredModal
                isOpen={showLoginModal}
                onLogin={() => {
                    setShowLoginModal(false);
                    navigate('/login');
                }}
                onCancel={() => setShowLoginModal(false)}
            />

            {/* Top Bar */}
            <div className="public-navbar">
                <div className="public-navbar-brand">
                    <img src="/PWS.png" alt="Logo" className="public-navbar-logo" />
                    <div className="brand-text">
                        <span className="brand-title">Movie Watchlist</span>
                        <span className="brand-subtitle">Discover & Save Your Movies</span>
                    </div>
                </div>
                <button 
                    className="btn-login-navbar"
                    onClick={() => navigate('/login')}
                >
                    <FiLogIn /> Login
                </button>
            </div>

            <div className="browse-container">
                {/* Search Section */}
                <div className="search-section">
                    <h2>Discover Movies</h2>
                    <p className="search-subtitle">Browse popular titles, then login to add them into your watchlist.</p>
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search for a movie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button type="submit" className="btn-search">Search</button>
                    </form>
                </div>

                {/* Movie Grid */}
                {loading ? (
                    <div className="loading">Loading movies...</div>
                ) : movies.length === 0 ? (
                    <div className="empty-info">
                        Belum ada film yang ditampilkan. Coba cari judul lain ya!
                    </div>
                ) : (
                    <>
                        <div className="movies-grid">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    inWatchlist={watchlistIds.includes(movie.id)}
                                    onAdd={() => handleAddToWatchlist(movie)}
                                    onRemove={() => handleRemoveFromWatchlist(movie.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="btn-pagination"
                                >
                                    Prev
                                </button>
                                <span className="page-info">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="btn-pagination"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PublicMovies;

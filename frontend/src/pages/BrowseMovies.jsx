import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import './Dashboard.css';

const BrowseMovies = () => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [watchlistIds, setWatchlistIds] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetchPopularMovies();
        fetchWatchlistIds();
    }, []);

    const fetchPopularMovies = async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await userAPI.getPopularMovies(pageNum);
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
            const response = await userAPI.searchMovies(searchQuery, 1);
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
                const response = await userAPI.searchMovies(searchQuery, newPage);
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
        }
    };

    const handleRemoveFromWatchlist = async (movieId) => {
        try {
            await userAPI.removeFromWatchlist(movieId);
            setWatchlistIds(watchlistIds.filter(id => id !== movieId));
        } catch (err) {
            console.error('Failed to remove:', err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Browse Movies</h1>
                </div>

                <div className="search-section">
                    <form onSubmit={handleSearch} className="search-box">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                            <FiSearch style={{ marginRight: '8px' }} />
                            Search
                        </button>
                    </form>
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2>{isSearching ? `Search Results: "${searchQuery}"` : 'Popular Movies'}</h2>
                        {isSearching && (
                            <button className="btn" onClick={() => { setSearchQuery(''); fetchPopularMovies(); }}>
                                Back to Popular
                            </button>
                        )}
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
                                        inWatchlist={watchlistIds.includes(movie.id)}
                                        onAdd={handleAddToWatchlist}
                                        onRemove={handleRemoveFromWatchlist}
                                        onViewDetail={setSelectedMovie}
                                    />
                                ))}
                            </div>

                            <div className="pagination">
                                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                                    Previous
                                </button>
                                <span>Page {page} of {Math.min(totalPages, 500)}</span>
                                <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <p>No movies found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Movie Detail Modal */}
            <MovieDetailModal
                movie={selectedMovie}
                isOpen={!!selectedMovie}
                onClose={() => setSelectedMovie(null)}
                onAdd={handleAddToWatchlist}
                inWatchlist={selectedMovie ? watchlistIds.includes(selectedMovie.id) : false}
            />
        </>
    );
};

export default BrowseMovies;

import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import MovieDetailModal from '../components/MovieDetailModal';
import './Dashboard.css';

const AdminPopular = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    const fetchPopularMovies = async () => {
        try {
            const response = await adminAPI.getPopularMovies(30);
            setMovies(response.data.movies);
        } catch (err) {
            console.error('Failed to load popular movies:', err);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/50x75?text=No+Image';
        return `https://image.tmdb.org/t/p/w200${path}`;
    };

    const handleViewDetail = (movie) => {
        setSelectedMovie({
            ...movie,
            id: movie.movie_id,
            poster_path: movie.poster_path
        });
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Popular Movies</h1>
                </div>

                <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
                    Movies most saved by users
                </p>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : movies.length === 0 ? (
                    <div className="empty-state">
                        <p>No movies saved yet.</p>
                    </div>
                ) : (
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Poster</th>
                                    <th>Title</th>
                                    <th>Release Date</th>
                                    <th>Rating</th>
                                    <th>Users Saved</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((movie, index) => (
                                    <tr key={movie.movie_id}>
                                        <td><strong>#{index + 1}</strong></td>
                                        <td>
                                            <img
                                                src={getImageUrl(movie.poster_path)}
                                                alt={movie.title}
                                                style={{ width: '50px', borderRadius: '4px' }}
                                            />
                                        </td>
                                        <td><strong>{movie.title}</strong></td>
                                        <td>{movie.release_date || 'N/A'}</td>
                                        <td>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</td>
                                        <td>
                                            <span style={{
                                                background: 'var(--color-light)',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontWeight: '600'
                                            }}>
                                                {movie.save_count} users
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon btn-view"
                                                onClick={() => handleViewDetail(movie)}
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Movie Detail Modal */}
            <MovieDetailModal
                movie={selectedMovie}
                isOpen={!!selectedMovie}
                onClose={() => setSelectedMovie(null)}
                isAdmin={true}
            />
        </>
    );
};

export default AdminPopular;

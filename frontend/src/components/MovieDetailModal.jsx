import React from 'react';
import { FiX } from 'react-icons/fi';
import './MovieDetailModal.css';

const MovieDetailModal = ({ movie, isOpen, onClose, onAdd, inWatchlist, isAdmin }) => {
    if (!isOpen || !movie) return null;

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className="movie-detail-overlay" onClick={onClose}>
            <div className="movie-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <FiX />
                </button>

                <div className="movie-detail-content">
                    <div className="movie-detail-poster">
                        <img src={imageUrl} alt={movie.title} />
                    </div>
                    <div className="movie-detail-info">
                        <h2>{movie.title}</h2>
                        <div className="movie-detail-meta">
                            <span className="detail-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                            <span className="detail-year">{movie.release_date?.split('-')[0] || 'N/A'}</span>
                        </div>
                        <div className="movie-detail-synopsis">
                            <h4>Synopsis</h4>
                            <p>{movie.overview || 'No synopsis available.'}</p>
                        </div>
                        {!isAdmin && !inWatchlist && onAdd && (
                            <button className="btn-add-detail" onClick={() => { onAdd(movie); onClose(); }}>
                                + Add to Watchlist
                            </button>
                        )}
                        {!isAdmin && inWatchlist && (
                            <span className="already-in-watchlist">✓ Already in Watchlist</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailModal;

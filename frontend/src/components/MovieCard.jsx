import React from 'react';
import { FiInfo } from 'react-icons/fi';
import './MovieCard.css';

const MovieCard = ({ movie, onAdd, onRemove, inWatchlist, status, onStatusChange, onViewDetail, isAdmin }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={imageUrl} alt={movie.title} />
                <div className="movie-overlay">
                    {/* View Detail Button - always shown */}
                    <button className="btn-detail" onClick={() => onViewDetail && onViewDetail(movie)}>
                        <FiInfo /> View Detail
                    </button>

                    {/* For non-admin users */}
                    {!isAdmin && (
                        <>
                            {!inWatchlist ? (
                                <button className="btn-add" onClick={() => onAdd && onAdd(movie)}>
                                    + Add to Watchlist
                                </button>
                            ) : (
                                <>
                                    <button className="btn-remove" onClick={() => onRemove && onRemove(movie.movie_id)}>
                                        Remove from Watchlist
                                    </button>
                                    {onStatusChange && (
                                        status === 'watchlist' ? (
                                            <button className="btn-watched" onClick={() => onStatusChange(movie.movie_id, 'watched')}>
                                                Mark Watched
                                            </button>
                                        ) : (
                                            <button className="btn-unwatched" onClick={() => onStatusChange(movie.movie_id, 'watchlist')}>
                                                Unwatched
                                            </button>
                                        )
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                    <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="movie-year">{movie.release_date?.split('-')[0] || 'N/A'}</span>
                </div>
                {status && (
                    <span className={`movie-status status-${status}`}>
                        {status === 'watched' ? 'Watched' : 'To Watch'}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MovieCard;

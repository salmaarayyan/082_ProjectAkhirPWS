const axios = require('axios');

class TmdbApiService {
    constructor() {
        this.apiKey = process.env.TMDB_API_KEY;
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    }

    // Search movies
    async searchMovies(query, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/search/movie`, {
                params: {
                    api_key: this.apiKey,
                    query: query,
                    page: page,
                    language: 'id-ID'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching movies:', error.message);
            throw new Error('Failed to search movies');
        }
    }

    // Get popular movies
    async getPopularMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/movie/popular`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'id-ID'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting popular movies:', error.message);
            throw new Error('Failed to get popular movies');
        }
    }

    // Get now playing movies
    async getNowPlayingMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/movie/now_playing`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'id-ID'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting now playing movies:', error.message);
            throw new Error('Failed to get now playing movies');
        }
    }

    // Get movie details
    async getMovieDetails(movieId) {
        try {
            const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, {
                params: {
                    api_key: this.apiKey,
                    language: 'id-ID'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting movie details:', error.message);
            throw new Error('Failed to get movie details');
        }
    }

    // Get trending movies
    async getTrendingMovies(timeWindow = 'week') {
        try {
            const response = await axios.get(`${this.baseUrl}/trending/movie/${timeWindow}`, {
                params: {
                    api_key: this.apiKey,
                    language: 'id-ID'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting trending movies:', error.message);
            throw new Error('Failed to get trending movies');
        }
    }

    // Get image URL
    getImageUrl(path) {
        if (!path) return null;
        return `${this.imageBaseUrl}${path}`;
    }
}

module.exports = TmdbApiService;

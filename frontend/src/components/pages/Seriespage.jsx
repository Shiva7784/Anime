import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

function Seriespage() {
    const { id } = useParams();
    const [series, setSeries] = useState(null);
    const [recommend, setRecommend] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const [toggleWatchlist, setToggleWatchlist] = useState(false);
    
    const navigate = useNavigate();
    const { backend_url, user } = useContext(AppContent);
    const toast = useToast();
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;


    useEffect(() => {
        const fetchSeriesDetails = async () => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?language=en-US&api_key=${apiKey}`);
                setSeries(res.data);

                const res2 = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1&api_key=${apiKey}`);
                setRecommend(res2.data.results || []);

                const videoRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US&api_key=${apiKey}`);
                const trailer = videoRes.data.results?.find(
                    (vid) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
                );
                setTrailerKey(trailer);

                if (backend_url) {
                    const res4 = await axios.get(backend_url + '/api/list/all');
                    if (res4.data.success) {
                        const isInWatchlist = res4.data.listofall.some((item) => String(item.movieid) === String(id));
                        if (isInWatchlist) setToggleWatchlist(true);
                    }
                }
            } catch (error) {
                console.error("Error loading series details:", error);
            }
        };

        fetchSeriesDetails();
    }, [id, backend_url]);

    const handleWatchlist = async () => {
        if (!user) {
            toast.warning("Please login to manage your watchlist.");
            navigate('/login');
            return;
        }

        const newValue = !toggleWatchlist;
        setToggleWatchlist(newValue);

        if (newValue) {
            try {
                let res = await axios.post(backend_url + "/api/list/add", {
                    userid: user.id,
                    movieid: series.id,
                    moviename: series.name,
                    imageurl: `https://image.tmdb.org/t/p/w500/${series.poster_path}`,
                    language: series.original_language
                });
                if (res.data.success) toast.success("Added to Watchlist!");
            } catch (error) {
                toast.error("Failed to add to Watchlist.");
            }
        } else {
            try {
                let res = await axios.delete(backend_url + `/api/list/delete/`, {
                    data: { userid: user.id, movieid: series.id }
                });
                if (res.data.success) toast.info("Removed from Watchlist.");
            } catch (error) {
                toast.error("Failed to remove from Watchlist.");
            }
        }
    };

    if (!series) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <span className="text-red-500 font-bold text-xl animate-pulse">Loading series...</span>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen pb-12 overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative min-h-[85vh] md:min-h-screen flex items-end w-full bg-neutral-950">
                {series.backdrop_path && (
                    <img 
                        className="absolute inset-0 w-full h-full object-cover opacity-40" 
                        src={`https://image.tmdb.org/t/p/original/${series.backdrop_path}`}
                        alt={series.name}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 hidden lg:block"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 flex flex-col md:flex-row items-center md:items-end gap-6 lg:gap-12">
                    <div className="shrink-0">
                        <img 
                            className="w-44 sm:w-56 md:w-64 lg:w-72 rounded-2xl shadow-2xl border-2 border-white/20 object-cover aspect-[2/3] transform hover:scale-105 transition duration-300" 
                            src={series.poster_path ? `https://image.tmdb.org/t/p/w500/${series.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                            alt={series.name}
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
                            <span className="text-xs bg-red-600/30 text-red-400 border border-red-500/40 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                TV Series
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
                            {series.name}
                        </h1>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4 text-sm sm:text-base text-gray-200">
                            <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded-full font-semibold">
                                Rating: {series.vote_average ? `${series.vote_average.toFixed(1)} ★` : '8.5 ★'}
                            </span>
                            {series.number_of_seasons && (
                                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-gray-300">
                                    📺 {series.number_of_seasons} {series.number_of_seasons === 1 ? 'Season' : 'Seasons'} ({series.number_of_episodes} Ep)
                                </span>
                            )}
                            {series.first_air_date && (
                                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-gray-300">
                                    📅 {series.first_air_date.slice(0, 4)}
                                </span>
                            )}
                        </div>

                        {series.genres && (
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                {series.genres.map((genre) => (
                                    <span key={genre.id} className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-md border border-white/10">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-6">
                            <button 
                                onClick={() => navigate(`/series/player/${id}`)}  
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                            >
                                🎬 Watch Series Now
                            </button>

                            <button 
                                onClick={() => {
                                    if (trailerKey) {
                                        window.open(`https://www.youtube.com/watch?v=${trailerKey.key}`, '_blank');
                                    } else {
                                        toast.warning('Trailer not available for this series.');
                                    }
                                }} 
                                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-5 sm:px-7 py-3 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                            >
                                ▶ Watch Trailer
                            </button>

                            <button 
                                onClick={handleWatchlist} 
                                className={`px-5 sm:px-7 py-3 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer text-sm sm:text-base border ${
                                    toggleWatchlist 
                                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 hover:bg-emerald-600/40' 
                                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                }`}
                            >
                                {toggleWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                            </button> 
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview & Extra Info */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
                <div className="bg-neutral-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-red-500 border-l-4 border-red-600 pl-3">
                        Synopsis
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                        {series.overview || "No overview available for this series."}
                    </p>
                </div>

                {/* Recommendations */}
                {recommend && recommend.length > 0 && (
                    <div className="pt-4">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white border-l-4 border-red-600 pl-3">
                            Similar Anime Series
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                            {recommend.slice(0, 10).map((rec) => (
                                <div 
                                    key={rec.id}
                                    onClick={() => {
                                        navigate(`/series/${rec.id}`);
                                        navigate(0);
                                    }}
                                    className="bg-neutral-900 border border-white/10 relative group rounded-xl overflow-hidden cursor-pointer hover:border-red-600/50 hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                    <img
                                        src={rec.poster_path ? `https://image.tmdb.org/t/p/w500/${rec.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                        className="w-full h-56 sm:h-64 lg:h-72 object-cover text-xs text-gray-400" 
                                        alt={rec.name}
                                    />

                                    <div className="p-3 w-full h-full absolute inset-0 opacity-0 bg-black/80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center">
                                        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 px-2">
                                            {rec.name}
                                        </h3>
                                        <span className="text-xs text-red-400 mt-2 font-medium">
                                            {rec.first_air_date?.slice(0, 4)}
                                        </span>
                                        <span className="mt-3 text-xs bg-red-600 text-white px-3 py-1 rounded-full font-semibold">
                                            View Series
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Seriespage;

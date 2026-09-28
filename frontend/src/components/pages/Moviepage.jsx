import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import WatchList from './WatchList';

function Moviepage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [recommend, setRecommend] = useState([]);
    const [Trailerkey, setTrailerkey] = useState(null);
    const navigate = useNavigate();
    const [Togglewatchlist, setTogglewatchlist] = useState(false);
    const { backend_url, user } = useContext(AppContent);
    const [watchlist, setWatchlist] = useState();
    const toast = useToast();

    useEffect(() => {
        const fetchmovie = async () => {
            try { 
                let key = import.meta.env.VITE_TMDB_API_KEY;


                let res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${key}`);
                setMovie(res.data);

                let res2 = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1&api_key=${key}`);
                setRecommend(res2.data.results);

                let videodata = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?langauge-en-US&api_key=${key}`);

                const trailer = videodata.data.results?.find(
                    (vid) => vid.site === "YouTube" && vid.type === "Trailer" 
                );

                setTrailerkey(trailer);

                let res4 = await axios.get(backend_url + '/api/list/all');

                if (res4.data.success) {
                    const isInWatchlist = res4.data.listofall.filter((items) => items.movieid === id );
                    if (isInWatchlist.length > 0) {
                        setTogglewatchlist(true);
                    }
                }
            } catch(error) {
                console.log("error in the api of movie page" , error);
            }
        }
        
        fetchmovie();
    }, [id, backend_url]);

    const handlewatchlist = async () => {
        if (!user) {
            toast.warning("Please login to manage your watchlist.");
            navigate('/login');
            return;
        }

        const newValue = !Togglewatchlist;
        setTogglewatchlist(newValue);

        if (newValue) {
            try {
                let res = await axios.post(backend_url + "/api/list/add", {
                    userid: user.id,
                    movieid: movie.id,
                    moviename: movie.original_title,
                    imageurl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                    language: movie.original_language
                });
    
                if (res.data.success) {
                    toast.success("Added to Watchlist!");
                } else {
                    toast.error("Could not add to Watchlist.");
                }
            } catch(error) {
                console.log("error in the watchlist api", error);
                toast.error("Failed to add to Watchlist.");
            }
        } else {
            try {
                let res = await axios.delete(backend_url + `/api/list/delete/`, {
                    data: {
                        userid: user.id,
                        movieid: movie.id,
                    }
                });
    
                if (res.data.success) {
                    toast.info("Removed from Watchlist.");
                } else {
                    toast.error("Could not remove from Watchlist.");
                }
            } catch(error) {
                console.log("error in the watchlist api", error);
                toast.error("Failed to remove from Watchlist.");
            }
        }
    } 
 

    if(!movie) {

        return (
            <div className='flex justify-center items-center h-screen'>
                <span className='text-red-600 text-bold text-xl'>...Loading</span>
            </div>
        )

    }


    return (
        <div className='bg-black text-white min-h-screen pb-12 overflow-x-hidden'>
            {/* Hero Banner Section */}
            <div className='relative min-h-[85vh] md:min-h-screen flex items-end w-full bg-neutral-950'>
                {/* Backdrop Image */}
                {movie.backdrop_path && (
                    <img 
                        className='absolute inset-0 w-full h-full object-cover opacity-40' 
                        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                        alt={movie.original_title}
                    />
                )}

                {/* Gradient Overlays for smooth readability */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent'></div>
                <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 hidden lg:block'></div>

                {/* Hero Content Container */}
                <div className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 flex flex-col md:flex-row items-center md:items-end gap-6 lg:gap-12'>
                    {/* Poster Image */}
                    <div className='shrink-0'>
                        <img 
                            className='w-44 sm:w-56 md:w-64 lg:w-72 rounded-2xl shadow-2xl border-2 border-white/20 object-cover aspect-[2/3] transform hover:scale-105 transition duration-300' 
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                            alt={movie.original_title}
                        />
                    </div>

                    {/* Movie Info & Actions */}
                    <div className='flex-1 text-center md:text-left'>
                        <h1 className='text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight'>
                            {movie.original_title}
                        </h1>

                        {/* Metadata Pills */}
                        <div className='flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4 text-sm sm:text-base text-gray-200'>
                            <span className='bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded-full font-semibold'>
                                Rating: {movie.vote_average ? `${movie.vote_average.toFixed(1)} ★` : (movie.popularity > 230 ? '⭐⭐⭐⭐⭐' : '⭐⭐⭐')}
                            </span>
                            {movie.release_date && (
                                <span className='bg-white/10 border border-white/20 px-3 py-1 rounded-full text-gray-300'>
                                    📅 {movie.release_date}
                                </span>
                            )}
                            {movie.original_language && (
                                <span className='bg-red-500/20 text-red-300 border border-red-500/40 px-3 py-1 rounded-full uppercase font-medium'>
                                    🌐 {movie.original_language}
                                </span>
                            )}
                        </div>

                        {/* Genres */}
                        {movie.genres && (
                            <div className='flex flex-wrap justify-center md:justify-start gap-2 mt-3'>
                                {movie.genres.map((genre) => (
                                    <span key={genre.id} className='text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-md border border-white/10'>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className='flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-6'>
                            <button 
                                onClick={() => {
                                    if (Trailerkey) {
                                        window.open(`https://www.youtube.com/watch?v=${Trailerkey.key}`, '_blank');
                                    } else {
                                        toast.warning('Trailer not available for this title.');
                                    }
                                }} 

                                className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 sm:px-7 py-3 rounded-xl font-bold transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer text-sm sm:text-base'
                            >
                                ▶ Watch Trailer
                            </button>

                            <button 
                                onClick={() => navigate(`/movie/player/${id}`)}  
                                className='bg-white text-black hover:bg-gray-200 px-6 sm:px-8 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2 cursor-pointer text-sm sm:text-base'
                            >
                                🎬 Watch Now
                            </button>

                            <button 
                                onClick={handlewatchlist} 
                                className={`px-5 sm:px-7 py-3 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer text-sm sm:text-base border ${
                                    Togglewatchlist 
                                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 hover:bg-emerald-600/40' 
                                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                }`}
                            >
                                {Togglewatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                            </button> 
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview & Extra Information */}
            <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10'>
                {/* Synopsis Section */}
                <div className='bg-neutral-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-xl'>
                    <h2 className='text-2xl sm:text-3xl font-bold mb-3 text-red-500 border-l-4 border-red-600 pl-3'>
                        Synopsis
                    </h2>
                    <p className='text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed'>
                        {movie.overview || "No overview available for this title."}
                    </p>
                </div>

                {/* Production Companies Section */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className='bg-neutral-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-xl'>
                        <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-white border-l-4 border-red-600 pl-3'>
                            Production Companies
                        </h2>
                        <div className='flex flex-wrap gap-4 sm:gap-6 items-center'>
                            {movie.production_companies.map((company) => (
                                <div key={company.id} className='bg-white/10 border border-white/15 p-3 rounded-xl flex items-center gap-3 max-w-xs hover:border-red-500/50 transition'>
                                    {company.logo_path ? (
                                        <img className='w-16 sm:w-20 h-10 object-contain bg-white rounded p-1' src={`https://image.tmdb.org/t/p/w500/${company.logo_path}`} alt={company.name} />
                                    ) : (
                                        <div className='w-10 h-10 rounded bg-white/20 flex items-center justify-center text-xs font-bold text-white'>🏢</div>
                                    )}
                                    <span className='text-white text-xs sm:text-sm font-medium truncate'>{company.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommended Movies Section */}
                {recommend && recommend.length > 0 && (
                    <div className='pt-4'>
                        <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-white border-l-4 border-red-600 pl-3'>
                            You Might Also Like
                        </h2>

                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6'>
                            {recommend.slice(0, 10).map((rec) => (
                                <div 
                                    key={rec.id}
                                    onClick={() => {
                                        navigate(`/movie/${rec.id}`);
                                        navigate(0);
                                    }}
                                    className='bg-neutral-900 border border-white/10 relative group rounded-xl overflow-hidden cursor-pointer hover:border-red-600/50 hover:scale-105 transition-all duration-300 shadow-lg'
                                >
                                    <img
                                        src={rec.poster_path ? `https://image.tmdb.org/t/p/w500/${rec.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                        className='w-full h-56 sm:h-64 lg:h-72 object-cover text-xs text-gray-400' 
                                        alt={rec.original_title}
                                    />

                                    <div className='p-3 w-full h-full absolute inset-0 opacity-0 bg-black/80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center'>
                                        <h3 className='text-sm sm:text-base font-bold text-white line-clamp-2 px-2'>
                                            {rec.original_title}
                                        </h3>
                                        <span className='text-xs text-red-400 mt-2 font-medium'>
                                            {rec.release_date?.slice(0, 4)}
                                        </span>
                                        <span className='mt-3 text-xs bg-red-600 text-white px-3 py-1 rounded-full font-semibold'>
                                            View Movie
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

export default Moviepage;


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const SERIES_SERVERS = [
    { id: 'vidsrc_v2', name: 'Server 1 (TV Compatible)', getUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
    { id: 'vidsrc_me', name: 'Server 2 (VidSrc Direct)', getUrl: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}` },
    { id: 'embed_su', name: 'Server 3 (EmbedSu)', getUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
    { id: '2embed', name: 'Server 4 (Backup)', getUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` }
];

function Seriesplayer() {
    const { id, season: seasonParam, episode: episodeParam } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [series, setSeries] = useState(null);
    const [currentSeason, setCurrentSeason] = useState(parseInt(seasonParam) || 1);
    const [currentEpisode, setCurrentEpisode] = useState(parseInt(episodeParam) || 1);
    const [seasonDetails, setSeasonDetails] = useState(null);
    const [currentServer, setCurrentServer] = useState(SERIES_SERVERS[0]);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;


    // Fetch TV Series metadata
    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?language=en-US&api_key=${apiKey}`);
                setSeries(res.data);
            } catch (err) {
                console.error("Error fetching series data:", err);
                toast.error("Failed to load series details.");
            }
        };
        fetchSeries();
    }, [id]);

    // Fetch Season details (episodes list)
    useEffect(() => {
        const fetchSeason = async () => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${currentSeason}?language=en-US&api_key=${apiKey}`);
                setSeasonDetails(res.data);
            } catch (err) {
                console.error("Error fetching season details:", err);
            }
        };
        fetchSeason();
    }, [id, currentSeason]);

    const playerUrl = currentServer.getUrl(id, currentSeason, currentEpisode);

    const handlePrevEpisode = () => {
        if (currentEpisode > 1) {
            setCurrentEpisode((prev) => prev - 1);
        } else if (currentSeason > 1) {
            setCurrentSeason((prev) => prev - 1);
            setCurrentEpisode(1);
        }
    };

    const handleNextEpisode = () => {
        const totalEpisodes = seasonDetails?.episodes?.length || 24;
        if (currentEpisode < totalEpisodes) {
            setCurrentEpisode((prev) => prev + 1);
        } else if (series && currentSeason < series.number_of_seasons) {
            setCurrentSeason((prev) => prev + 1);
            setCurrentEpisode(1);
        }
    };

    return (
        <div className="w-full min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col items-center">
            {/* Player Header */}
            <div className="w-full max-w-5xl mb-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        {series?.name || 'Anime Series'}
                        <span className="text-xs bg-red-600/30 text-red-400 border border-red-500/40 px-2.5 py-0.5 rounded-full font-semibold uppercase">
                            Series
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-red-400 font-medium mt-1">
                        Season {currentSeason} — Episode {currentEpisode}
                        {seasonDetails?.episodes?.find(e => e.episode_number === currentEpisode)?.name ? `: ${seasonDetails.episodes.find(e => e.episode_number === currentEpisode).name}` : ''}
                    </p>
                </div>

                {/* Prev / Next Episode Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevEpisode}
                        disabled={currentSeason === 1 && currentEpisode === 1}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                            currentSeason === 1 && currentEpisode === 1
                                ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer'
                        }`}
                    >
                        ◀ Prev Ep
                    </button>
                    <button
                        onClick={handleNextEpisode}
                        className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition shadow-lg shadow-red-600/30 cursor-pointer"
                    >
                        Next Ep ▶
                    </button>
                </div>
            </div>

            {/* Server Selector Bar */}
            <div className="w-full max-w-5xl mb-4 flex flex-wrap items-center gap-2 bg-neutral-900/80 border border-white/10 p-3 rounded-xl shadow-lg">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                    🌐 Server / Audio:
                </span>
                {SERIES_SERVERS.map((server) => (
                    <button
                        key={server.id}
                        onClick={() => setCurrentServer(server)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                            currentServer.id === server.id
                                ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-md shadow-red-600/30'
                                : 'bg-white/10 border-white/15 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        {server.name}
                    </button>
                ))}
            </div>

            {/* Video Player Container */}
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-red-600/30 shadow-2xl shadow-red-950/50 bg-neutral-950">
                <iframe
                    key={`${currentServer.id}-${currentSeason}-${currentEpisode}`}
                    className="w-full h-full border-0"
                    src={playerUrl}
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    referrerPolicy="origin"
                    allowFullScreen
                    title={`${series?.name || 'Series'} Season ${currentSeason} Episode ${currentEpisode}`}
                ></iframe>
            </div>

            {/* Season & Episode Controls */}
            <div className="w-full max-w-5xl mt-8 space-y-6">
                {/* Season Selection */}
                {series && series.seasons && (
                    <div className="bg-neutral-900/60 border border-white/10 p-4 sm:p-6 rounded-2xl">
                        <h3 className="text-sm sm:text-base font-bold text-gray-300 mb-3">Select Season:</h3>
                        <div className="flex flex-wrap gap-2">
                            {series.seasons
                                .filter((s) => s.season_number > 0)
                                .map((s) => (
                                    <button
                                        key={s.id || s.season_number}
                                        onClick={() => {
                                            setCurrentSeason(s.season_number);
                                            setCurrentEpisode(1);
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer ${
                                            currentSeason === s.season_number
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-lg shadow-red-600/30'
                                                : 'bg-white/10 border-white/15 text-gray-300 hover:bg-white/20'
                                        }`}
                                    >
                                        Season {s.season_number}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* Episode Selection */}
                <div className="bg-neutral-900/60 border border-white/10 p-4 sm:p-6 rounded-2xl">
                    <h3 className="text-sm sm:text-base font-bold text-gray-300 mb-3">
                        Episodes (Season {currentSeason}):
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-1">
                        {seasonDetails?.episodes ? (
                            seasonDetails.episodes.map((ep) => (
                                <button
                                    key={ep.id}
                                    onClick={() => setCurrentEpisode(ep.episode_number)}
                                    className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                        currentEpisode === ep.episode_number
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-md shadow-red-600/30'
                                            : 'bg-white/10 border-white/15 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                    Ep {ep.episode_number}
                                </button>
                            ))
                        ) : (
                            Array.from({ length: 24 }, (_, i) => i + 1).map((epNum) => (
                                <button
                                    key={epNum}
                                    onClick={() => setCurrentEpisode(epNum)}
                                    className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                        currentEpisode === epNum
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-md shadow-red-600/30'
                                            : 'bg-white/10 border-white/15 text-gray-300 hover:bg-white/20'
                                    }`}
                                >
                                    Ep {epNum}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center pt-2">
                    <button
                        onClick={() => navigate(`/series/${id}`)}
                        className="text-gray-400 hover:text-red-500 transition duration-200 text-sm sm:text-base font-medium cursor-pointer flex items-center gap-2"
                    >
                        ← Back to Series Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Seriesplayer;

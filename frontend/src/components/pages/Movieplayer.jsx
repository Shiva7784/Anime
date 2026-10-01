import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MOVIE_SERVERS = [
    { id: 'vidsrc', name: 'Server 1 (VidSrc)', getUrl: (id) => `https://vidsrc.ru/movie/${id}?autoplay=true&colour=ff0000` },
    { id: '2embed', name: 'Server 2 (Backup)', getUrl: (id) => `https://www.2embed.cc/embed/${id}` }
];

function Movieplayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentServer, setCurrentServer] = useState(MOVIE_SERVERS[0]);

    return (
        <div className='w-full min-h-screen bg-black flex justify-center items-center flex-col px-4 pt-24 pb-12 text-white'> 
            <h1 className='text-white text-2xl sm:text-4xl font-bold tracking-wide font-serif mb-4 text-center'>
                Now Playing Movie
            </h1>

            {/* Server & Audio Selector */}
            <div className='w-full max-w-5xl mb-4 flex flex-wrap items-center gap-2 bg-neutral-900/80 border border-white/10 p-3 rounded-xl shadow-lg'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1'>
                    🌐 Server / Audio:
                </span>
                {MOVIE_SERVERS.map((server) => (
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

            <div className='w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-red-950/30 bg-neutral-950'>
                <iframe
                    key={currentServer.id}
                    className='w-full h-full border-0'
                    src={currentServer.getUrl(id)}
                    allowFullScreen
                    title="Movie Player"
                ></iframe>
            </div>

            <button 
                onClick={() => { navigate(`/movie/${id}`) }} 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 mt-8 text-base sm:text-lg font-medium cursor-pointer flex items-center gap-2"
            >
                ← Back to Movie Details
            </button>
        </div>
    );
}

export default Movieplayer;


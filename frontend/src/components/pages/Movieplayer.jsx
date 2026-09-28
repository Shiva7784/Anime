import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Movieplayer() {

    const {id} =  useParams();

    const navigate = useNavigate();

    console.log("id from movie player",id);
    return (
        <div className='w-full min-h-screen bg-black flex justify-center items-center flex-col px-4 pt-24 pb-12'> 
            <h1 className='text-white text-2xl sm:text-4xl font-bold tracking-wide font-serif mb-6 text-center'>
                Now Playing
            </h1>

            <div className='w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-red-950/30 bg-neutral-950'>
                <iframe
                    className='w-full h-full border-0'
                    src={`https://vidsrc.ru/movie/${id}?autoplay=true&colour=ff0000`}
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


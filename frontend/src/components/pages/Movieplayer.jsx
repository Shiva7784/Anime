import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Movieplayer() {

    const {id} =  useParams();

    const navigate = useNavigate();

    console.log("id from movie player",id);
    return (
        <>

       
        <div className='w-full h-screen bg-black flex justify-center items-center flex-col'> 
            <h1 className='text-white text-3xl font-bold tracking-wide font-serif'>Now Playing</h1>

            <iframe
            className='w-140 h-100 mt-5 border border-white shadow-lg rounded-lg shadow-white/50 max-w-5xl mx-auto'
            src={`https://vidsrc.ru/movie/${id}?autoplay=true&colour=ff0000`}
            allowFullScreen
            
            >
            </iframe>

            <button onClick={() => { navigate(`/movie/${id}`) }} className="text-gray-300  hover:text-white  mt-8  text-xl cursor-pointer">
        ← Back to Movie
        </button>
        </div>
        
        </>
    )
}

export default Movieplayer

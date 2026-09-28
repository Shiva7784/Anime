import React, { useContext, useEffect } from 'react'
import homeimg from '../assets/homeimg.png';
import { Link } from 'react-router-dom';
import { AppContent } from './context/AppContext';
import axios from 'axios';
import Cardlist from './Cardlist';
import Footer from './Footer';

function Home() {

    useEffect(  () => {

        async function call () {
              
        let key = import.meta.env.VITE_TMDB_API_KEY;

        let res = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity&with_genres=16&api_key=${key}`)
        
        console.log("data from the tmdb api",res);

        let res2 = await axios.get(`https://api.themoviedb.org/3/movie/1115544/videos?langauge-en-US&api_key=${key}`);


        console.log("data from the tmdb api for videos",res2);

        const trailer = res2.data.results?.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer" 
        );

        console.log("trailer key ",trailer)

        // let res3 = await axios.get(`https://api.themoviedb.org/3/discover/movie/non_playing?with_genres=16&language=en-US&page=1&api_key=${key}`)

        // console.log("aniamted data of non playing", res3 );

        }

        call();

    },[])


    const {user} = useContext(AppContent);

    console.log("data from the user in home page",user);


    return (
       <>

        <div className="relative transition-all duration-500 ease-in-out w-full min-h-[70vh] sm:min-h-screen flex items-end justify-center pb-12 sm:pb-20">
            
            {/* Background Image */}
            <img 
                src={homeimg} 
                alt="home"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {/* Overlay Content */}
            {
                user ?

                <div className="relative z-10 w-[92%] sm:w-11/12 max-w-4xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl shadow-black/80 text-center bg-black/40 backdrop-blur-xl border border-white/10 mx-auto">
                
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-md tracking-tight">
                        Welcome <span className='text-red-500'>{user.name}</span>
                    </h1>
                    
                    <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-200">
                        Your power awaits at <span className='text-red-400 font-medium'>{user.email}</span> 
                    </p>

                    <p className="mt-3 text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
                        Gear up <span className='text-red-400 font-semibold'>{user.name}</span>! A new journey begins now. We will show them all — every hidden power, every epic battle, and every adventure waiting for you.
                    </p>

                    <div className="mt-6 flex justify-center">
                        <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-red-600 to-red-800 shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition duration-300 cursor-pointer">
                            Start Watching
                        </button>
                    </div>

                </div>

            :

                <div className="relative z-10 w-[92%] sm:w-11/12 max-w-4xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl shadow-black/80 text-center bg-black/40 backdrop-blur-xl border border-white/10 mx-auto">
                    
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-md tracking-tight">
                        Awaken The Power
                    </h1>
                    
                    <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-200 max-w-xl mx-auto">
                        Enter the world of legendary warriors and hidden powers
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5">
                        <Link to='/signup' className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 sm:px-12 py-3 rounded-xl font-bold cursor-pointer transition shadow-lg shadow-red-600/30 text-center">
                            Start Watching
                        </Link>

                        <Link to='/signup' className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white border border-white/20 cursor-pointer transition text-center">
                            Sign Up
                        </Link>
                    </div>

                </div>

            }
        </div>
            
        <Cardlist title="Popular Anime Series" category="popularity.desc" media_type="tv" />

        <Cardlist title="Top Rated Anime Series" category="vote_average.desc" media_type="tv" />

        <Cardlist title="Action & Adventure Series" category="popularity.desc" genres="16,10759" media_type="tv" />

        <Cardlist title="Popular Anime Movies" category="popularity.desc" media_type="movie" />

        <Cardlist title="Top Rated Anime Movies" category="vote_average.desc" media_type="movie" />

        <Cardlist title="Kids & Family Series" category="popularity.desc" genres="16,10751" media_type="tv" />

        <Footer/>


       </>
    )
}

export default Home;
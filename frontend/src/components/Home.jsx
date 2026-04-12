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
              
        let key = '3869be8e95600094552f92b847bfd6ca';

        let res = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity&with_genres=16&api_key=${key}`)
        
        console.log("data from the tmdb api",res);

        let res2 = await axios.get('https://api.themoviedb.org/3/movie/1115544/videos?langauge-en-US&api_key=3869be8e95600094552f92b847bfd6ca ');

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

<div className="relative transition-all duration-500 ease-in-out">
            
            {/* Background Image */}
            <img 
                src={homeimg} 
                alt="home"
                className="w-full h-screen object-cover"
            />

            {/* Overlay Content */}
            {
                user ?

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2  p-6 rounded-lg shadow-2xl shadow-black/40 h-64 w-4xl text-center bg-white/20 backdrop-blur-xl border border-white/20  ">
                
                <h1 className="text-7xl font-bold text-white drop-shadow-lg">Welcome <span className='text-red-500'>{user.name}</span></h1>
                
                <p className="mt-2 text-white">
                    Your power awaits at <span className='' >{user.email} </span> 
                </p>

                <p className="text-white max-w-xl leading-relaxed ml-28 ">
                    Gear up <span className='text-gray-400' >{user.name}!</span>,  A new journey begins now. We will show them all -- every  <br></br>
                    hidden power , every epic battle , and every adventure waiting for you. 
                </p>

                <div className="mt-2 flex justify-center gap-4">
                <button className="px-8 py-3 rounded-lg text-white 
                       bg-gradient-to-r from-red-500 to-red-700
                       shadow-lg shadow-red-500/40
                       hover:scale-105 transition duration-300">
                     Start Watching
                    </button>
                </div>

            </div>

            :

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2  p-6 rounded-lg shadow-lg h-64 w-4xl text-center ">
                
                <h1 className="text-7xl font-bold text-white">Awaken The Power</h1>
                
                <p className="mt-2 text-white">
                    Enter the world of legendary warriors and hidden powers
                </p>

                <div className="mt-4 flex justify-center gap-4">
                    <Link className="bg-red-600 text-white px-16 py-2 rounded-md font-bold cursor-pointer">
                        Start Watching
                    </Link>

                    <Link to='/signup' className=" px-16 py-2 bg-white/10 rounded-md font-bold text-white cursor-pointer">
                        Sign Up
                    </Link>
                </div>

            </div>

            }
        </div>
            
        <Cardlist title="Now playing" category="popularity" />

        <Cardlist title="Popular Anime " category="popularity.desc" />

        <Cardlist title="Top Rated Anime " category="vote_average.desc&vote_count.get=1000" />

        <Cardlist title="Upcoming Anime " category="release_date.desc" />

        <Cardlist title="action Anime " category="popularity"  genres="16,28" />

        <Cardlist title="kids Anime " category="popularity"  genres="16,10751" />

        <Footer/>




       </>
    )
}

export default Home;
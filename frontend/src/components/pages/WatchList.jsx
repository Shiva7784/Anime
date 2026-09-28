import React, { useContext, useEffect, useState } from 'react'
import homeimg from '../../assets/homeimg.png';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function WatchList() {

    const {backend_url} = useContext(AppContent);
    const [WatchMovie , setWatchmovie] = useState();
    const {user, setUser  } = useContext(AppContent);
    const navigate = useNavigate();

    console.log("backend url in watchlist",backend_url);

    console.log("this is the WatchMovie" , WatchMovie)

    useEffect(() => {

        const fetchmovie = async () => {
            try {

                let res = await axios.get( backend_url + '/api/list/all');
                console.log("data from the watch list useeffect",res);
                if(res.data.success) {
                    let filtereddata = res.data.listofall.filter((movie) => user.id == movie.userid);
                    setWatchmovie(filtereddata);
                    console.log("this is watch movie data",WatchMovie);
                }
                else{
                    setWatchmovie("could not fetch data")
                }
            }
            catch(error) {
                console.log(error.message);
            }

        }

        fetchmovie();

    },[])

    if(!user) {
        return (
            <div className='flex justify-center items-center w-full h-screen bg-black '>
                <h1 className='text-red-500 text-4xl text-bold'>Please login to to see the watch list.</h1>
            </div>
        )
    }

    if(!WatchMovie) {
        return (
            <div className='flex justify-center items-center w-full h-screen bg-black'>
                <h1 className='text-red-500 text-4xl text-bold'>...Loading</h1>
            </div>
        )
    }


    if(WatchMovie.length == 0) {
        return (
            <div className='flex justify-center items-center w-full h-screen bg-black '>
                <h1 className='text-red-500 text-4xl text-bold'>empty watch list add any movie </h1>
            </div>
        )
    }
    
    
    return (
        <div className='bg-black w-full min-h-screen text-white px-4 sm:px-6 lg:px-8 pt-24 pb-16'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-2xl sm:text-4xl font-extrabold tracking-tight border-l-4 border-red-600 pl-3'>
                    Your WatchList
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
                    {WatchMovie.map((watch) => {
                        const imageSrc = watch.imageurl 
                            ? (watch.imageurl.startsWith('http') ? watch.imageurl : `https://image.tmdb.org/t/p/w500/${watch.imageurl}`)
                            : 'https://via.placeholder.com/500x750?text=No+Poster';

                        return (
                            <div 
                                key={watch._id || watch.movieid}
                                onClick={() => {
                                    navigate(`/movie/${watch.movieid}`);
                                    navigate(0);
                                }}
                                className='group relative bg-neutral-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-red-600/50 hover:scale-105 transition-all duration-300 shadow-lg'
                            >
                                <img 
                                    className='w-full h-56 sm:h-64 lg:h-72 object-cover text-xs text-gray-400'  
                                    src={imageSrc}
                                    alt={watch.moviename || 'Movie'}
                                />

                                <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center items-center text-center'>
                                    <h2 className='text-sm sm:text-base font-bold text-white line-clamp-2'>
                                        {watch.moviename}
                                    </h2>
                                    <span className='mt-3 text-xs bg-red-600 text-white px-3 py-1 rounded-full font-semibold'>
                                        Watch Now
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default WatchList;


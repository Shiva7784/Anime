import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Searchpage() {
    const { id } = useParams();
    const [searchdata, setSearchdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchsearchdata = async () => {
            setLoading(true);
            try {
                let key = import.meta.env.VITE_TMDB_API_KEY;

                let res = await axios.get(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(id)}&language=en-US&page=1&api_key=${key}`);
                
                const filteredResults = (res.data.results || []).filter(
                    (item) => item.media_type === 'movie' || item.media_type === 'tv'
                );

                setSearchdata(filteredResults);
            } catch (error) {
                console.log("error in search api", error);
                setSearchdata([]);
            } finally {
                setLoading(false);
            }
        };

        fetchsearchdata();
    }, [id]);

    if (loading) {
        return (
            <div className='flex justify-center items-center w-full min-h-screen bg-black'>
                <h1 className='text-red-500 text-2xl font-bold animate-pulse'>Searching...</h1>
            </div>
        );
    }

    return (
        <div className='bg-black w-full min-h-screen text-white px-4 sm:px-6 lg:px-8 pt-24 pb-16'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-2xl sm:text-4xl font-extrabold tracking-tight border-l-4 border-red-600 pl-3'>
                    Search Results for <span className='text-red-500'>"{id}"</span>
                </h1>

                {searchdata.length === 0 ? (
                    <div className='flex justify-center items-center py-20'>
                        <h2 className='text-gray-400 text-xl font-semibold'>No titles found matching "{id}"</h2>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8'>
                        {searchdata.map((search) => {
                            const isTv = search.media_type === 'tv';
                            const title = isTv ? (search.name || search.original_name) : (search.title || search.original_title);
                            const releaseYear = (isTv ? search.first_air_date : search.release_date)?.slice(0, 4);
                            const targetPath = isTv ? `/series/${search.id}` : `/movie/${search.id}`;

                            return (
                                <div 
                                    key={`${search.media_type}-${search.id}`}
                                    onClick={() => {
                                        navigate(targetPath);
                                        navigate(0);
                                    }}
                                    className='group relative bg-neutral-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-red-600/50 hover:scale-105 transition-all duration-300 shadow-lg'
                                >
                                    <img 
                                        className='w-full h-56 sm:h-64 lg:h-72 object-cover text-xs text-gray-400'
                                        src={search.poster_path ? `https://image.tmdb.org/t/p/w500/${search.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                                        alt={title || 'Media'}
                                    />

                                    <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                                        isTv 
                                            ? 'bg-red-950/90 text-red-300 border-red-600/50' 
                                            : 'bg-black/80 text-gray-300 border-white/20'
                                    }`}>
                                        {isTv ? 'Series' : 'Movie'}
                                    </span>

                                    <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center items-center text-center'>
                                        <h2 className='text-sm sm:text-base font-bold text-white line-clamp-2'>
                                            {title}
                                        </h2>
                                        {releaseYear && (
                                            <span className='text-xs mt-2 font-medium text-red-400'>
                                                {releaseYear}
                                            </span>
                                        )}
                                        <span className='mt-3 text-xs bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full font-semibold shadow-md shadow-red-600/30'>
                                            View {isTv ? 'Series' : 'Movie'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Searchpage;

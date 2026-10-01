import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import { Link } from 'react-router-dom';
import axios from 'axios';

function Cardlist({ title, category, genres, media_type = "movie" }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchanimation = async () => {
            try {
                let key = import.meta.env.VITE_TMDB_API_KEY;
                const endpoint = media_type === "tv"

                    ? `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=${category}&with_genres=${genres ? genres : "16"}&api_key=${key}`
                    : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=${category}&with_genres=${genres ? genres : "16"}&api_key=${key}`;

                let res = await axios.get(endpoint);
                setData(res.data.results || []);
            } catch (error) {
                console.log("error in the api", error);
            }
        };

        fetchanimation();
    }, [category, genres, media_type]);

    return (
        <div className='text-white px-4 sm:px-8 md:px-12 py-6 bg-black overflow-hidden'>
            <div className="flex items-center justify-between mb-4">
                <h2 className='text-xl sm:text-2xl font-bold tracking-wide text-white border-l-4 border-red-600 pl-3'>
                    {title}
                </h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border ${
                    media_type === 'tv' 
                        ? 'bg-red-950/50 text-red-300 border-red-600/40' 
                        : 'bg-white/10 text-gray-300 border-white/10'
                }`}>
                    {media_type === 'tv' ? '📺 TV Series' : '🎬 Movie'}
                </span>
            </div>

            <Swiper
                slidesPerView={2.2}
                spaceBetween={12}
                breakpoints={{
                    480: { slidesPerView: 2.8, spaceBetween: 14 },
                    640: { slidesPerView: 3.5, spaceBetween: 16 },
                    768: { slidesPerView: 4.5, spaceBetween: 18 },
                    1024: { slidesPerView: 5.5, spaceBetween: 20 },
                    1280: { slidesPerView: 6.5, spaceBetween: 20 }
                }}
                className="mySwiper py-2"
            >
                {data.map((item, index) => {
                    const itemTitle = item.name || item.original_name || item.title || item.original_title || 'Untitled';
                    const targetLink = media_type === "tv" ? `/series/${item.id}` : `/movie/${item.id}`;

                    return (
                        <SwiperSlide key={item.id || index} className="group cursor-pointer">
                            <Link to={targetLink} className="block">
                                <div className="relative overflow-hidden rounded-xl bg-neutral-900 border border-white/10 shadow-lg group-hover:scale-105 group-hover:border-red-600/50 transition-all duration-300">
                                    <img
                                        src={item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                                        alt={itemTitle}
                                        className="h-52 sm:h-60 md:h-72 w-full object-cover text-xs text-gray-400 group-hover:opacity-90 transition"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                        <span className="text-xs font-semibold text-red-400">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-gray-200 text-center pt-2.5 truncate px-1 group-hover:text-red-500 transition duration-200">
                                    {itemTitle}
                                </p>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}

export default Cardlist;

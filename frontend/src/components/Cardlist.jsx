import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import "Swiper/css";
import { Link } from 'react-router-dom';
import axios from 'axios';



function Cardlist({ title, category , genres}) {

    const [data , setData ] = useState([]);
 

    useEffect(() => {

        const fetchanimation = async () => {

            try{

                       
        let key = '3869be8e95600094552f92b847bfd6ca';

        // let res = axios.get(`https://api.themoviedb.org/3/discover/movie/${category}?with_genres=16&language=en-US&page=1&api_key=${key}`)

        // let res = await axios.get(`https://api.themoviedb.org/3/discover/movie/${category}?language=en-US&page=1&api_key=${key}`)   

        let res = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=${category}&with_genres=${genres?genres:"16"}&api_key=${key}`)
    
        setData(res.data.results);

        console.log("data from the tmdb api in cardlist component",res);;



            }
            catch(error) {
                console.log("error in the api" , error);
            }     

        }

        fetchanimation();

    },[])

   
        console.log("data from the api in cardlist component outside the useeffect", data);

    return (

        <>

<div className='text-white md:px-4 bg-black'>
            <h2 className='pt-10 pb-5 text-lg font-medium'>{title}</h2>

            {/* <Swiper slidesPerView={"auto"} spaceBetween={10} className='mySwiper'>

                { data.map((item, index) => {
                    console.log("item from the map()", item);
                    <SwiperSlide key={index} className="max-w-72">
                        <Link to={`/movie/${item.id}`}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                            alt=''
                            className='h-44 w-full object-center object-cover'
                        />
                        <p className='text-center pt-2'>{item.original_title}</p>
                        </Link>
                    </SwiperSlide>
                })
                }

            </Swiper> */}


<Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
        {data.map((item, index) => (
          <SwiperSlide key={index} className="max-w-72 ">
            <Link to={`/movie/${item.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              alt="No image available"
              className="h-44 w-full object-center object-cover text-white"
            />
            <p className="text-center pt-2">{item.original_title}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>


            
        </div>
        
        </>
       
    )
}

export default Cardlist

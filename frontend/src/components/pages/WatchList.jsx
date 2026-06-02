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
        <>
        <div className=' bg-black p-5 min-h-screen'>

            {/* <img 
                src={homeimg} 
                alt="home"
                className="w-full h-screen object-cover"
            /> */}

            {/* <img 
                src='https://img.freepik.com/premium-photo/abstract-lines-background-red-black-color-duotone-theme_776674-864570.jpg?semt=ais_incoming&w=740&q=80' 
                alt="home"
                className="w-full  object-cover"
            /> */}

        

            <div className='mt-15'>

            <h1 className='text-4xl font-bold text-white '>Your WatchList</h1>

                {/* <span className='text-white'> {WatchMovie} </span> */}
            <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6 mt-10 px-6"  >

            { WatchMovie?.map((watch) => {

                return (

                    <div className=' group relative hover:scale-105 transition  hover:shadow-md shadow-white/50'>
                        <img 
                        className='w-full h-full object-cover rounded-lg text-white'  
                        src={`https://image.tmdb.org/t/p/w500/${watch.imageurl}`}
                        alt='No image available'
                        />

                        <div onClick={() => {
                            navigate(`/movie/${watch.movieid}`);
                            navigate(0);
                        }} className=' absolute inset-0 opacity-0 group-hover:opacity-75 transition hover:bg-black flex justify-center items-center '>
                            <h1 className='text-white text-xl text-bold tracking-wide'>{watch.moviename}</h1>

                        </div>
                    </div>
                


                )



                


            })}


            </div>

        

                


            </div>



        </div>

        </>
    )
}

export default WatchList

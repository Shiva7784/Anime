import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import WatchList from './WatchList';


function Moviepage() {

    const { id } = useParams();

    const [movie,setMovie] = useState(null);

    const [recommend,setRecommend] = useState([]);

    const [Trailerkey,setTrailerkey] = useState(null);

    const  navigate = useNavigate();

    const [Togglewatchlist , setTogglewatchlist] = useState(false);

    const {backend_url} = useContext(AppContent);

    const [watchlist , setWatchlist] = useState();

    console.log("toggle watch list at the atart " , Togglewatchlist)

    console.log("id from movie page",id);

    // console.log("length of recommend data in the movie page",recommend.length)

    // console.log("length of the movie usestae",movie.length)


    useEffect(() => {

        const fetchmovie = async () => {

            try { 
                // let Id = JSON.stringify(id.id);
                // console.log("id from movie page after tostring",Id);

                
                let key = '3869be8e95600094552f92b847bfd6ca';

                let res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${key}`);
                console.log("data from the tmdb api in movie page",res.data);
                setMovie(res.data);


                let res2 = await axios.get( `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1&api_key=${key}`)
                console.log("data fro recommend movies ",res2.data.results);
                setRecommend(res2.data.results);

                console.log("length of recommend data in the movie page",recommend.length)

                let videodata = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?langauge-en-US&api_key=${key}`);

                console.log("data from the tmdb api for videos",videodata);
        
                const trailer = videodata.data.results?.find(
                    (vid) => vid.site === "YouTube" && vid.type === "Trailer" 
                );
        
                console.log("trailer key ",trailer)

                setTrailerkey(trailer);

                let res4 = await axios.get( backend_url + '/api/list/all');
                console.log("data from the watch list useeffect",res4);

                if(res4.data.success) {
                    
                    console.log("this is watch movie data",watchlist);

                    // const isInWatchlist = res4.data.listofall.some((item) => item.movieid === movie.id);
                    // setTogglewatchlist(isInWatchlist);

                    const isInWatchlist = res4.data.listofall.filter((items) => items.movieid === id )

                    if(isInWatchlist) {
                        setTogglewatchlist(true);
                    }
                }
                



            }
            catch(error) {
                console.log("error in the api of movie page" , error);
            }


        }
        
        fetchmovie();

    } , [])


    const handlewatchlist = async () => {

        const newValue = !Togglewatchlist;

        setTogglewatchlist(newValue);
        console.log("toggle watchlist value",Togglewatchlist);
        // alert(Togglewatchlist);
        if(newValue) {
            try {
                let res = await axios.post( backend_url + "/api/list/add",{
                    movieid : movie.id,
                    moviename : movie.original_title,
                    imageurl : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                    language : movie.original_language
                })
    
                console.log("response from the watchlist api",res);
    
                if(res.data.success){
                    alert("added to the watchlist")
                }
            }
            catch(error) {
                console.log("error in the watchlist api",error);
            }
        }
        else {
            try {
                let res = await axios.delete( backend_url + `/api/list/delete/${id}`)
    
                console.log("response from the watchlist api",res);
    
                if(res.data.success){
                    alert("deleted from the watchlist");
                }
                
            }
            catch(error) {
                console.log("error in the watchlist api",error);
            }
        }
    } 

    if(!movie) {

        return (
            <div className='flex justify-center items-center h-screen'>
                <span className='text-red-600 text-bold text-xl'>...Loading</span>
            </div>
        )

    }


    return (
        <>

        <div className='bg-[#181818] relative'>

            {/* <img 
                src={homeimg} 
                alt="home"
                className="w-full h-screen object-cover opacity-50"
            /> */}


            <div className='absolute inset-0 '>

            <img className='w-full h-screen  ' src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}/>

            <div className='absolute top-80 left-30 flex gap-40   '>

            <img className='w-60 h-80 inset-0 border border-lg' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}/>

            <div className=' mt-15 '>

                <h1 className='text-6xl font-bold  bg-linear-to-t from-red-500 to-black/90 text-transparent bg-clip-text'>{movie.original_title}</h1>
                
                {/* <h1 className='text-2xl text-gray-300 mt-5'>{movie.overview}</h1> */}

                <span className='text-2xl mt-5 bg-linear-to-b from-yellow-400 to-white text-transparent bg-clip-text' >Rating: {movie.popularity > 230.0000 ? '⭐⭐⭐⭐⭐' : '⭐⭐⭐'  } </span>

                <span className='text-2xl mt-5 bg-linear-to-b from-red-500 to-white text-transparent bg-clip-text'>Release Date : {movie.release_date}</span>

                <h1 className='text-2xl  mt-5 bg-linear-to-b from-red-500 to-white text-transparent bg-clip-text'>Language : {movie.original_language}</h1>
                
                {/* <span className='text-2xl text-gray-300 mt-5'>Genres : {movie.genres.map((genre) => genre.name).join(', ')}</span> */}

                <button onClick={() => {
                    if(Trailerkey) {
                        window.open(`https://www.youtube.com/watch?v=${Trailerkey.key}`, '_blank');
                        // <Link to={`https://www.youtube.com/watch?v=${Trailerkey.key}`} target="_blank" rel="noopener noreferrer">
                        //     Watch Trailer
                        // </Link>
                    } else {
                        alert('Trailer not available');
                    }

                }} className='bg-red-600 text-white px-5 py-2 rounded mt-5 cursor-pointer'>Watch Trailer</button>
                {/* <Link className='bg-red-600 text-white px-5 py-2 rounded mt-5 ml-5 cursor-pointer' to={`https://www.youtube.com/watch?v=${Trailerkey.key}`} target="_blank" rel="noopener noreferrer">
                            Watch Trailer
                </Link> */}

                <button onClick={() => {

                        navigate(`/movie/player/${id}`);

                        }}  className='bg-red-600 text-white px-10 py-2 rounded mt-5 ml-5 cursor-pointer'>Watch now </button>

                <button onClick={handlewatchlist} className='bg-red-600 text-white px-5 py-2 rounded mt-5 ml-5 cursor-pointer'>{Togglewatchlist ? "Added to watchlist" : "add to watchlist"}</button> 


            </div>

            

            </div>


            
            <div className='w-full h-auto bg-black p-5'>
                <h1 className='text-white text-bold text-4xl mb-5'>Synopsis</h1>
                <p className='text-white text-lg '>{movie.overview}</p>

                
                    <h1 className='text-white text-bold text-4xl  mt-8'>Production companies</h1>
                    {/* <img className='w-20 h-20' src={`https://image.tmdb.org/t/p/w500/${movie.production_companies[0].logo_path}`} alt={movie.production_companies[0].name} />
                    <img className='w-20 h-20' src={`https://image.tmdb.org/t/p/w500/${movie.production_companies[1].logo_path}`} alt={movie.production_companies[1].name} /> */}
                    {/* <img className='w-20 h-20' src={`https://image.tmdb.org/t/p/w500/${movie.production_companies[2].logo_path}`} alt={movie.production_companies[2].name} /> */}

                    <div className='flex gap-5  my-5 '>

                    {movie.production_companies.map((company) => {
                        return (
                            <div className=' rounded-lg '>
                                <img className='w-60 h-20 bg-white ' src={`https://image.tmdb.org/t/p/w500/${company.logo_path}`} alt={company.name} />
                                <span className='text-white text-lg'>{company.name}</span>
                            </div>
                        )
                    })}
                    </div>

                    <span className='text-2xl text-gray-300 mt-5'>Genres : {movie.genres.map((genre) => genre.name).join(', ')}</span>


                    {

                        
                        recommend?.length > 0 && (
                            <div className='p-4'>
                                <h2 className='text-2xl font-semibold mb-4 text-white'> You might also like  </h2>

                                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>

                                    {recommend.slice(0,10).map((rec) => {

                                        return (

                                            <div 
                                        key={rec.id}
                                        className='bg-[#232323] relative group rounded-lg overflow-hidden hover:scale-105 transition'
                                        >
                                            
                                            
                                            <img
                                            src={`https://image.tmdb.org/t/p/w500/${rec.poster_path}`}
                                            className='w-full h-full object-cover text-white' 
                                            alt='No image available'
                                        
                                            />

                                            <div onClick={() =>{
                                                
                                                navigate(`/movie/${rec.id}`)

                                                navigate(0)

                                            } } className='p-2 w-full h-full absolute inset-0 opacity-0 bg-black group-hover:opacity-75 transition  flex flex-col justify-center items-center'>
                                                <h3 className='text-lg font-semibold text-white'> {rec.original_title}</h3>
                                                <h1 className='text-lg text-gray-400'>
                                                    {rec.release_date?.slice(0,4)}
                                                </h1>

                                            </div>

                                            
                                        
                                        </div>  


                                        )

                                         
                                    })}



                                </div>




                            </div>
                            
                            
                        )


                    }

                   

                


                </div>


            </div>







           

        </div>
        </>
    )
}

export default Moviepage

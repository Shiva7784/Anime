import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Searchpage() {
    const { id } = useParams();
    const [searchdata , setSearchdata] = useState([]);
    const navigate = useNavigate();
    console.log("this is search name from the useparams",id);

    useEffect(() => {
        const fetchsearchdata = async () => {
            try{

                let key = '3869be8e95600094552f92b847bfd6ca';

                let res = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${id}&language=en-US&page=1&api_key=${key}`)
                console.log("data from the search api",res);
                if (res.data.results.length > 0 ) {
                    setSearchdata(res.data.results);
                    console.log("this is search data",searchdata);
                }
                else{
                    setSearchdata("no data found")
                }
            }
            catch(error) {
                console.log("error in the search api" , error); 
            }
        }

        fetchsearchdata();

    } , [id])

    if(!searchdata) {
        return (
            <div className='flex justify-center items-center'>
                <h1 className='text-red-500 text-4xl text-bold'>...Loading</h1>
            </div>
        )
    }
    

    return (

        <>


        <div className='bg-black w-full min-h-screen p-5'>
            
            {/* <h1 className='text-white '> this  is  search page for {id}</h1> */}

            <div className='mt-15' >
            <h1 className='text-white text-4xl   '>Search Results :</h1>

            <div className='max-w-7xl mx-auto grid grid-cols-5 gap-6 mt-10 px-6'>

{
    searchdata.map((search) => {
        return (

            <div className='group relative hover:scale-105 transition  hover:shadow-md shadow-white/50'>
                <img 
                className='w-full h-full object-cover rounded-lg text-white'
                src={`https://image.tmdb.org/t/p/w500/${search.poster_path}`}
                alt='No image available'
                />

                <div onClick={() => {
                    navigate(`/movie/${search.id}`);
                    navigate(0);
                }} className=' absolute inset-0 opacity-0 group-hover:opacity-75 transition hover:bg-black flex justify-center items-center '>
                    <h1 className='text-white text-xl text-bold tracking-wide' >{search.original_title}</h1>
                </div>
            </div>

        )
    })
}


</div>

            </div>

           
           
            
        </div>

        </>

    )
}

export default Searchpage

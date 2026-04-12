import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContent } from './context/AppContext';
import axios from 'axios';

function Navbar() {

    const {user, setUser , searchdata , setsearchdata } = useContext(AppContent);
    // const [searchchange , setsearchchange] = useState();
    const [toggle,setToggle] = useState("false");  
    const {backend_url} = useContext(AppContent); 
    const navigate = useNavigate();

    console.log("this is toggle variable",toggle.current);

    console.log("user data in navbar",user);


    const handlelogout = async () => {
        try{
            let res = await axios.post( backend_url + '/api/auth/logout',{}, {withCredentials: true});
            if(res.data.success){
                alert("Logout successful!");
                setUser(null);
                setTimeout(() => {
                    navigate('/');
                    navigate(0);
                    
                }, 1000);

            }
            else{
                alert("Logout failed. Please try again.");
            }
        }
        catch(err){
            console.log(err.message);
        }
    }


    // console.log("user.role" , user.role)

    return (

        <nav className='flex justify-evenly items-center mt-4  w-5xl mx-auto rounded-full h-14 bg-white/40 '>
            <div className='w-1/3'>
                <h1 className='text-3xl font-bold text-white '>ANIME</h1>
            </div>

            <div className='space-x-5 '>
                <Link to='/' className='text-white hover:text-red-600'>Home</Link>
                <Link to='/about' className='text-white hover:text-red-600' >About</Link>
                {/* <Link to='/Gallery' className='text-white hover:text-red-600'>Gallery</Link> */}
                <Link to='/watchlist' className='text-white hover:text-red-600 '>WatchList</Link>
                {/* <Link to='/Contact' className='text-white hover:text-red-600'>Contact</Link> */}
                <input type='search' onChange={(e) => {
                    // setsearchchange(e.target.value)
                    navigate(`/search/${e.target.value}`)
                    // console.log("search change", searchchange);
                    }} className=' border border-black p-1 rounded-lg outline-none text-white ' placeholder='search movies'/>

            </div>

           { user ? 

<div className='space-x-6 relative   border-white ' >
{/* <button  className='bg-red-500 text-white px-5 py-1.5  rounded-lg font-bold cursor-pointer'>Logout</button> */}
{/* <img src='https://www.freeiconspng.com/uploads/deadpool-icon-png-13.png' className='rounded-full w-15 h-15 ' ></img> */}

    {/* <span onClick={() => {setToggle(!toggle)}} className='text-white bg-red-600 font-bold mr-4 border px-5 py-1 rounded-full cursor-pointer '> 👤{user.name}▼</span> */}
    <div className='flex gap-3 border border-white/15 rounded-lg bg-white/10 '>
        <div className='p-1'>
            <span className='text-white'  >{user.name}</span>
        </div>
        <div className='border border-white/15 p-1' >
            <img src='https://cdn3.emoji.gg/unicode/apple/red-triangle-pointed-down.png' onClick={() => {setToggle(!toggle)}} className='w-5 h-5 rounded-full' />
        </div>

         {/* Dropdown */}
         {toggle && (
                        <div className='absolute top-11 right-0 w-20 bg-white rounded-lg shadow-lg text-black'>
                            <ul>
                                <li className='p-2 hover:bg-gray-200 cursor-pointer'>Profile</li>
                                <li onClick={handlelogout} className='p-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
                            </ul>
                        </div>
                    )}
    </div>



                   


</div>


  :    
            
<div className='space-x-6 ' >
<Link to='/login' className='bg-white px-5 py-1.5  rounded-lg font-bold cursor-pointer'>Login</Link>
<Link to='/signup' className='bg-red-500 px-5 py-1.5 rounded-lg text-white font-bold cursor-pointer'>Sign UP</Link>
</div>  
        } 
        
        </nav>

    )
}

export default Navbar

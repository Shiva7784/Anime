import React, { useContext, useState } from 'react'
import homeimg from '../assets/homeimg.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContent } from './context/AppContext';

function Userlogin() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const {backend_url,setuserData} = useContext(AppContent);

    console.log(backend_url);

    const navigate = useNavigate();

    const logindata = {email:email,password:password}

    const loginsubmit = async () => {
        try{
            console.log(logindata)
            let res = await axios.post( backend_url + '/api/auth/login', logindata, {withCredentials: true} );
            console.log(res.data);
            if (res.data.success){
                setError("Login successfull redirecting to home page...")
                setEmail('');
                setPassword('');
                // setuserData(true);
                setTimeout(() => {
                    navigate('/');
                    navigate(0);
                    
                }, 2000);
            }
            else{
                setError(`${res.data.message} Please try again.`)
                console.log(res.data.message);
            }
        }
        catch(err){
            console.log(err);
            alert('Login failed. Please try again.');
        }
    }

    return (
        <div className="relative">
            
            {/* Background Image */}
            <img 
                src={homeimg} 
                alt="home"
                className="w-full h-screen object-cover"
            />

            

            <div className=" border h-auto absolute bottom-50 left-1/2 transform -translate-x-1/2  p-6 rounded-lg shadow-lg w-2xl text-center bg-white/20 backdrop-blur-md ">

                <span className='text-green-400 font-bold'>{error}</span>
                
            <h1 className="text-4xl font-bold text-black">Welcome back</h1>
            
            <p className="mt-2 text-black mb-4">
                Login to continue your adventure
            </p>

            <input type='email' className='bg-white/10 text-black w-md font-bold  py-3' placeholder='Email' onChange={(e) => {setEmail(e.target.value)}} /> <br></br>
                <input type='password' className='bg-white/10 text-black w-md my-5 py-3 font-bold' placeholder='password' onChange={(e) => {setPassword(e.target.value)}} /> <br></br>
                <button className="bg-red-600 text-white px-16 py-2 rounded-md font-bold cursor-pointer" onClick={loginsubmit} >
                    Login
                </button>
                <h3 className='text-black mt-3'>Don't have an account? <Link to='/signup' className='text-red-700 font-bold cursor-pointer'  >Sign Up</Link></h3>


            </div>


        </div>
            
        
    )
}

export default Userlogin


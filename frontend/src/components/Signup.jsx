import React, { useContext, useState } from 'react'
import homeimg from '../assets/homeimg.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from './context/AppContext';


function Signup() {

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [display, setDisplay] = useState();

    const {backend_url} = useContext(AppContent);

    const data = {name:username,email:email,password:password};

    const datasubmit = async () => {
        console.log(data);
        try{
            // let res = axios.post('http://localhost:5000/signup', {
            //     username: username,
            //     email: email,
            //     password: password
            // });
            let res = await axios.post( backend_url + '/api/auth/register', data, {withCredentials: true} );
            console.log(res.data);
            // let resdata = res.json();
            // console.log(resdata);
            if (res.data.success){
                setDisplay("Signup successful! Please login to continue.");
                console.log(res.data.message);
                setUsername('');
                setEmail('');
                setPassword('');
            }
            else{
                setDisplay(`${res.data.message} Please try again.`)
                console.log(res.data.message);
            }
            
        }
        catch(err){
            console.log(err);
            alert('Signup failed. Please try again.');
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
       
            <div className=" border absolute bottom-50 left-1/2 top-25 transform -translate-x-1/2  p-6 rounded-lg shadow-lg h-120 w-2xl text-center bg-white/20 backdrop-blur-md ">
                
            <span className='text-green-400 font-bold'>{display}</span>

                <h1 className="text-4xl font-bold text-black">join Now</h1>

                <p className="mt-2 text-black mb-4">
                    Create an account to start your Journey
                </p>
                <input type='text' value={username} className='bg-white/10 text-black w-md font-bold p-5 ' placeholder='Username' onChange={(e)=> {setUsername(e.target.value)} }/> <br></br>
                <input type='email' value={email} className='bg-white/10 text-black w-md font-bold p-5 mt-3' placeholder='Email' onChange={(e) => {setEmail(e.target.value)}} /> <br></br>
                <input type='password' value={password} className='bg-white/10 text-black w-md font-bold p-5 mt-3' placeholder='password' onChange={(e)=>{setPassword(e.target.value)}} /> <br></br>
                <button className="bg-red-600 text-white px-16 py-2 rounded-md font-bold cursor-pointer p-5 mt-4    " onClick={datasubmit} >
                    Sign Up
                </button>
                <h3 className='text-black mt-3'>Don't have an account? <Link to='/login' className='text-red-700 font-bold cursor-pointer mt-3' >Login</Link></h3>


            </div>

        </div>
    )
}

export default Signup

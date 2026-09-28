import React, { useContext, useState } from 'react'
import homeimg from '../assets/homeimg.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from './context/AppContext';
import { useToast } from './context/ToastContext';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [display, setDisplay] = useState('');

    const { backend_url } = useContext(AppContent);
    const toast = useToast();

    const data = { name: username, email: email, password: password };

    const datasubmit = async () => {
        try {
            let res = await axios.post(backend_url + '/api/auth/register', data, { withCredentials: true });
            if (res.data.success) {
                const msg = "Signup successful! Please login to continue.";
                setDisplay(msg);
                toast.success(msg);
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                const msg = `${res.data.message} Please try again.`;
                setDisplay(msg);
                toast.error(msg);
            }
        } catch (err) {
            console.log(err);
            toast.error('Signup failed. Please try again.');
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-24 pb-12 bg-black overflow-hidden">
            {/* Background Image */}
            <img 
                src={homeimg} 
                alt="home"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            {/* Form Card */}
            <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl text-center bg-black/60 backdrop-blur-xl border border-white/15 my-auto">
                {display && (
                    <div className='mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold'>
                        {display}
                    </div>
                )}

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Join Now</h1>
                <p className="mt-2 text-gray-300 text-sm mb-6">
                    Create an account to start your journey
                </p>

                <form onSubmit={(e) => { e.preventDefault(); datasubmit(); }} className="space-y-4">
                    <div>
                        <input 
                            type='text' 
                            value={username || ''} 
                            className='w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm outline-none focus:border-red-500 focus:bg-black/40 transition' 
                            placeholder='Username' 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type='email' 
                            value={email || ''} 
                            className='w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm outline-none focus:border-red-500 focus:bg-black/40 transition' 
                            placeholder='Email address' 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={password || ''} 
                            className='w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 text-sm outline-none focus:border-red-500 focus:bg-black/40 transition' 
                            placeholder='Password' 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 text-base cursor-pointer focus:outline-none select-none transition"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? '👁️' : '🙈'}
                        </button>
                    </div>

                    
                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-600/30 cursor-pointer text-sm sm:text-base mt-2"
                    >
                        Sign Up
                    </button>
                </form>

                <p className='text-gray-300 text-sm mt-6'>
                    Already have an account? {' '}
                    <Link to='/login' className='text-red-500 font-bold hover:underline cursor-pointer'>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;


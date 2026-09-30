import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContent } from './context/AppContext';
import { useToast } from './context/ToastContext';
import axios from 'axios';

function Navbar() {
    const { user, setUser } = useContext(AppContent);
    const [toggle, setToggle] = useState(false);  
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { backend_url } = useContext(AppContent); 
    const navigate = useNavigate();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    const handlelogout = async () => {
        try {
            let res = await axios.post(backend_url + '/api/auth/logout', {}, { withCredentials: true });
            if (res.data.success) {
                toast.success("Logout successful!");
                setUser(null);
                setTimeout(() => {
                    navigate('/');
                    navigate(0);
                }, 1000);
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } catch (err) {
            console.log(err.message);
            toast.error("Logout error: " + err.message);
        }
    };


    return (
        <header className='w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2'>
            <nav className='flex justify-between items-center w-full max-w-7xl mx-auto rounded-2xl md:rounded-full h-16 px-4 md:px-8 bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-xl relative z-50'>
                {/* Logo */}
                <div className='flex items-center'>
                    <Link to='/' className='text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent hover:opacity-90 transition duration-200'>
                        ANIME
                    </Link>
                </div>

                {/* Desktop Nav Links & Search */}
                <div className='hidden md:flex items-center space-x-6 lg:space-x-8'>
                    <Link to='/' className='text-gray-200 hover:text-red-500 font-medium transition duration-200'>Home</Link>
                    <Link to='/watchlist' className='text-gray-200 hover:text-red-500 font-medium transition duration-200'>WatchList</Link>
                    <form onSubmit={handleSearchSubmit} className='relative'>
                        <input 
                            type='search' 
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (val.trim() !== '') {
                                    navigate(`/search/${encodeURIComponent(val.trim())}`);
                                }
                            }} 
                            className='bg-white/10 border border-white/20 px-4 py-1.5 rounded-full outline-none text-white text-sm placeholder-gray-400 focus:border-red-500 focus:bg-black/40 transition duration-200 w-44 lg:w-64' 
                            placeholder='Search anime movies & series...'
                        />
                    </form>
                </div>


                {/* Desktop User / Auth Actions */}
                <div className='hidden md:flex items-center space-x-4'>
                    {user ? (
                        <div className='relative'>
                            <div 
                                onClick={() => setToggle(!toggle)} 
                                className='flex items-center gap-2 border border-white/20 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 cursor-pointer transition duration-200'
                            >
                                <span className='text-white font-medium text-sm'>{user.name}</span>
                                <span className='text-xs text-red-500'>▼</span>
                            </div>

                            {/* Dropdown Menu */}
                            {toggle && (
                                <div className='absolute top-12 right-0 w-36 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 text-sm'>
                                    <div className='px-4 py-2 text-xs text-gray-400 border-b border-white/10 truncate'>
                                        {user.email}
                                    </div>
                                    <button 
                                        onClick={handlelogout} 
                                        className='w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition cursor-pointer font-medium'
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex items-center space-x-3'>
                            <Link to='/login' className='bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full font-medium text-sm transition duration-200'>
                                Login
                            </Link>
                            <Link to='/signup' className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-1.5 rounded-full font-medium text-sm shadow-md shadow-red-600/30 transition duration-200'>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <div className='md:hidden flex items-center gap-3'>
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                        className='text-white p-2 focus:outline-none'
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className='md:hidden mt-2 w-full max-w-7xl mx-auto rounded-2xl bg-neutral-900/95 border border-white/10 p-5 backdrop-blur-xl text-white shadow-2xl flex flex-col gap-4 animate-fadeIn relative z-40'>
                    <form onSubmit={handleSearchSubmit} className='relative w-full'>
                        <input 
                            type='search' 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className='bg-white/10 border border-white/20 px-4 py-2 rounded-xl outline-none text-white text-sm placeholder-gray-400 focus:border-red-500 w-full' 
                            placeholder='Search movies & series...'
                        />
                    </form>

                    <div className='flex flex-col space-y-3 pt-2 border-t border-white/10'>
                        <Link 
                            to='/' 
                            onClick={() => setMobileMenuOpen(false)} 
                            className='text-gray-200 hover:text-red-500 font-medium py-1'
                        >
                            Home
                        </Link>
                        <Link 
                            to='/watchlist' 
                            onClick={() => setMobileMenuOpen(false)} 
                            className='text-gray-200 hover:text-red-500 font-medium py-1'
                        >
                            WatchList
                        </Link>
                    </div>

                    <div className='pt-3 border-t border-white/10 flex flex-col gap-2'>
                        {user ? (
                            <div className='flex flex-col gap-2'>
                                <div className='text-sm text-gray-300 font-semibold px-1'>
                                    👤 {user.name} ({user.email})
                                </div>
                                <button 
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handlelogout();
                                    }} 
                                    className='w-full text-center bg-red-600/30 border border-red-500/40 text-red-300 py-2 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition'
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className='flex gap-3 pt-1'>
                                <Link 
                                    to='/login' 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className='flex-1 text-center bg-white/10 text-white py-2 rounded-xl font-medium'
                                >
                                    Login
                                </Link>
                                <Link 
                                    to='/signup' 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className='flex-1 text-center bg-red-600 text-white py-2 rounded-xl font-medium shadow-lg shadow-red-600/30'
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;


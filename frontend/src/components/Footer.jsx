import React from 'react';

function Footer() {
    return (
        <footer className='bg-black border-t border-white/10 text-gray-400 py-10 px-4 sm:px-8 md:px-12'>
            <div className='max-w-7xl mx-auto'>
                <p className='text-sm sm:text-base font-medium mb-6 hover:text-white transition cursor-pointer'>
                    Questions? Call 000-800-919-1694 or Contact us
                </p>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-xs sm:text-sm text-gray-400'>
                    <ul className='space-y-2.5'>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>FAQ</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Investor Relations</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Privacy</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Speed Test</li>
                    </ul>

                    <ul className='space-y-2.5'>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Help Center</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Jobs</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Cookie Preferences</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Legal Notices</li>
                    </ul>

                    <ul className='space-y-2.5'>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Account</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Ways to Watch</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Corporate Information</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Only on Anime</li>
                    </ul>

                    <ul className='space-y-2.5'>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Media Center</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Terms of Use</li>
                        <li className='hover:underline hover:text-gray-200 cursor-pointer'>Contact Us</li>
                    </ul>
                </div>

                <div className='mt-8 pt-6 border-t border-white/5 text-xs text-gray-500 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-2'>
                    <span>© {new Date().getFullYear()} ANIME Streaming Service. All rights reserved.</span>
                    <span className='text-gray-400 font-semibold'>ANIME Global</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;


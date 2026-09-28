import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Userlogin from './components/Userlogin';
import Moviepage from './components/pages/Moviepage';
import Movieplayer from './components/pages/Movieplayer';
import Seriespage from './components/pages/Seriespage';
import Seriesplayer from './components/pages/Seriesplayer';
import WatchList from './components/pages/WatchList';
import Searchpage from './components/pages/Searchpage';

function App() {
  return (
    <div className='relative bg-black text-white min-h-screen overflow-x-hidden font-sans selection:bg-red-600 selection:text-white'>
      <div className='fixed top-0 left-0 w-full z-50'>
        <Navbar />
      </div>

      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Userlogin />} />
          <Route path='/movie/:id' element={<Moviepage />} />
          <Route path='/movie/player/:id' element={<Movieplayer />} />
          <Route path='/series/:id' element={<Seriespage />} />
          <Route path='/series/player/:id' element={<Seriesplayer />} />
          <Route path='/series/player/:id/:season/:episode' element={<Seriesplayer />} />
          <Route path='/watchlist' element={<WatchList />} /> 
          <Route path='/search/:id' element={<Searchpage />} />
          <Route 
            path='*' 
            element={
              <div className='flex justify-center items-center bg-black w-full min-h-screen'>
                <h1 className='text-white text-3xl sm:text-4xl font-bold'>404 | Page Not Found</h1>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}


export default App;

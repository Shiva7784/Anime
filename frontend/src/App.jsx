import React from 'react'
import { Routes , Route } from 'react-router-dom';
import Home from './components/home';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Userlogin from './components/Userlogin';
import Moviepage from './components/pages/Moviepage';
import Movieplayer from './components/pages/Movieplayer';
import WatchList from './components/pages/WatchList';
import Searchpage from './components/pages/Searchpage';




function App() {
  

  return (

    <>
    

    <div className='relative'>

        <div className='absolute top-0 left-0 w-full z-20 '>

        <Navbar/>

        </div>



        <Routes>

            <Route path='/' element={<Home/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/login' element={<Userlogin/>}></Route>
            <Route path='/movie/:id' element={<Moviepage/>}></Route>
            <Route path='/watchlist' element={<WatchList/>}></Route> 
            <Route path='/movie/player/:id' element={<Movieplayer/>}></Route>
            <Route path='*' element={
            <div className='flex justify-center items-center bg-black w-full h-screen'><h1 className='text-white text-4xl font-bold'>404 Not Found</h1></div>}></Route>
            <Route path='/search/:id' element={<Searchpage/>}></Route>
 
  
        </Routes>



      </div>





    
    </>

    

    
    

    

    
      

      

    

      
   
  )
}

export default App

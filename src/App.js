import React, { useState } from "react";
import Postlist from "./lessons/Postlist";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './home/Home.jsx'
import Search from "./search/Search";
import cl from './Main.module.css'
import Location from './locations/Location.jsx'
function App() {
 
  return (
    <div className="App">
      <div className={cl.main_content}>

    
     {/* <Home></Home> */}
{/* <Search></Search> */}
    <Routes>
      <Route path='/' element={<Home/>}> </Route>
      <Route path='/search' element={<Search></Search>}></Route>
      <Route path='/location/:id' element={<Location></Location>}></Route>
    </Routes>
    </div>
    </div>

  );
}

export default App;

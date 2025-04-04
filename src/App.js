import React, { useState } from "react";
import Postlist from "./lessons/Postlist";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './home/Home.jsx'
import Search from "./search/Search";
import cl from './Main.module.css'
import Location from './locations/Location.jsx'
import Account from "./account/Account.jsx";
import Subject_page from "./account/Subject_page.jsx";
import Links from "./account/links/Links.jsx";
import AuthPage from "./auth/AuthPage.jsx";
import Schedule from "./account/schedule/Schedule.jsx";
import AccountRoute from "./account/schedule/AccountRoute.jsx";
import NextLessonRoute from "./account/schedule/NextLessonRoute.jsx";
function App() {
 
  return (
    <div className="App">
      <div className={cl.main_content}>

    
     {/* <Home></Home> */}
{/* <Search></Search> */}
    <Routes>
      <Route path='/' element={<Home/>}> </Route>
      <Route path='/search' element={<Search></Search>}></Route>
      <Route path='/account' element={<Account></Account>}></Route>
      <Route path='/raiting' element={<Subject_page></Subject_page>}></Route>
      <Route path='/links' element={<Links></Links>}></Route>
      <Route path='/auth' element={<AuthPage></AuthPage>}></Route>
      <Route path='/schedule_actual' element={<AccountRoute></AccountRoute>}></Route>
      <Route path='/next_lesson' element={<NextLessonRoute></NextLessonRoute>}></Route>
      <Route path='/schedule' element={<Schedule></Schedule>}></Route>
      <Route path='/location/:id' element={<Location></Location>}></Route>

    </Routes>
    </div>
    </div>

  );
}

export default App;

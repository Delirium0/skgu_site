import React, { useState } from "react";
import Postlist from "./lessons/Postlist";
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'; // Импортируем useLocation
import Home from './home/Home.jsx';
import Search from "./search/Search";
import cl from './Main.module.css';
import Location from './locations/Location.jsx';
import Account from "./account/Account.jsx";
import Subject_page from "./account/Subject_page.jsx";
import Links from "./account/links/Links.jsx";
import AuthPage from "./auth/AuthPage.jsx";
import Schedule from "./account/schedule/Schedule.jsx";
import AccountRoute from "./account/schedule/AccountRoute.jsx";
import NextLessonRoute from "./account/schedule/NextLessonRoute.jsx";
import PageLayout from "./Components/pageLayout/PageLayout.jsx";
function App() {
  return (
    <div className="App">
      <div className={cl.main_content}>
        <Routes>
          {/* Маршрут AuthPage - без PageLayout */}
          <Route path='/auth' element={<AuthPage />}></Route>

          {/* Все остальные маршруты - оборачиваем в PageLayout */}
          <Route path='/' element={
            <PageLayout>
              <Home />
            </PageLayout>
          } />
          <Route path='/search' element={
            <PageLayout>
              <Search />
            </PageLayout>
          }></Route>
          <Route path='/account' element={
            <PageLayout>
              <Account />
            </PageLayout>
          }></Route>
          <Route path='/raiting' element={
            <PageLayout>
              <Subject_page />
            </PageLayout>
          }></Route>
          <Route path='/links' element={
            <PageLayout>
              <Links />
            </PageLayout>
          }></Route>
          <Route path='/schedule_actual' element={
            <PageLayout>
              <AccountRoute />
            </PageLayout>
          }></Route>
          <Route path='/next_lesson' element={
            <PageLayout>
              <NextLessonRoute />
            </PageLayout>
          }></Route>
          <Route path='/schedule' element={
            <PageLayout>
              <Schedule />
            </PageLayout>
          }></Route>
          <Route path='/location/:id' element={
            <PageLayout>
              <Location />
            </PageLayout>
          }></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
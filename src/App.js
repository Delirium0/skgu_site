// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import ARComponent from "./ar/ARComponent.jsx";
import Events_create from "./account/events_create/Events_create.jsx";
import Test from "./ar/Test.jsx";
import FacultyPage from "./faculties/FacultyPage.jsx";
import FeedbackPage from "./account/feetback/FeedbackPage.jsx"; // Убедись, что путь верный
import AdminEventsListPage from "./admin/AdminEventsListPage.jsx";
import AdminEventFormPage from "./admin/AdminEventFormPage.jsx";
import AdminDashboardLayout from "./admin/AdminDashboardLayout.jsx";
import AdminFacultiesListPage from "./admin/faculties/AdminFacultiesListPage"; // Импорт списка
import AdminFacultyFormPage from "./admin/faculties/AdminFacultyFormPage";   // Импорт формы
import EventModerationPage from "./admin/moderation/EventModerationPage.jsx";
import AdminFeedbacksListPage from "./admin/feedbacks/AdminFeedbacksListPage.jsx";
import AdminLocationsListPage from "./admin/locations/AdminLocationsListPage"; // Импорт списка
import AdminLocationFormPage from "./admin/locations/AdminLocationFormPage";   // Импорт формы
// --- Добавляем импорт ProtectedRoute ---
import ProtectedRoute from "./ProtectedRoute.jsx";
// --- Создай компоненты для админки/модерации (пока можно заглушки) ---
const AdminPanel = () => <div><h1>Панель Администратора</h1><p>Доступ только для админов.</p></div>;
const ModerationPage = () => <div><h1>Страница Модерации</h1><p>Доступ для админов и модераторов.</p></div>;
// ---

function App() {
  return (
    <div className="App">
      <div className={cl.main_content}>
        <Routes>
          {/* Маршрут AuthPage - без PageLayout и без защиты */}
          <Route path='/auth' element={<AuthPage />} />

          {/* --- ОБЫЧНЫЕ МАРШРУТЫ (ДОСТУПНЫ ВСЕМ АУТЕНТИФИЦИРОВАННЫМ?) --- */}
          {/* Если какие-то из этих страниц требуют просто входа, их тоже можно обернуть */}
          {/* <ProtectedRoute allowedRoles={['user', 'admin', 'teacher', 'moderator']}> ... </ProtectedRoute> */}
          {/* Но если они доступны и анонимам (кроме /account и т.п.), то оставляем как есть */}

          <Route path='/' element={<PageLayout><Home /></PageLayout>} />
          <Route path='/search' element={<PageLayout><Search /></PageLayout>} />
          <Route path='/location/:id' element={<PageLayout><Location /></PageLayout>} />
          <Route path='/faculty/:facultyId' element={<PageLayout><FacultyPage /></PageLayout>} />
          <Route path='/ar_page' element={<PageLayout><Test /></PageLayout>} />
          <Route path='/ar' element={<PageLayout><ARComponent /></PageLayout>} />

          {/* --- МАРШРУТЫ, ТРЕБУЮЩИЕ АУТЕНТИФИКАЦИИ (ЛЮБОЙ РОЛИ) --- */}
          {/* Можно создать массив со всеми ролями или просто проверить, что user существует */}
          {/* Для простоты, будем считать, что ProtectedRoute без allowedRoles проверяет только логин */}
          {/* Но лучше явно указать роли, если есть user, teacher и т.д. */}
          <Route path='/account' element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}> {/* Пример всех ролей */}
                  <PageLayout><Account /></PageLayout>
              </ProtectedRoute>
          } />
           <Route path='/raiting' element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}>
                  <PageLayout><Subject_page /></PageLayout>
              </ProtectedRoute>
          } />
          <Route path='/links' element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}>
                  <PageLayout><Links /></PageLayout>
              </ProtectedRoute>
          } />
           <Route path='/schedule_actual' element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}>
                  <PageLayout><AccountRoute /></PageLayout>
              </ProtectedRoute>
          } />
           <Route path='/next_lesson' element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}>
                  <PageLayout><NextLessonRoute /></PageLayout>
              </ProtectedRoute>
          } />
           <Route path='/schedule' element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}>
                  <PageLayout><Schedule /></PageLayout>
              </ProtectedRoute>
          } />
           <Route path='/feetback' element={ /* Опечатка в пути? Должно быть feedback? */
              <ProtectedRoute allowedRoles={['admin', 'user', 'teacher', 'moderator']}>
                   <PageLayout><FeedbackPage /></PageLayout>
              </ProtectedRoute>
          } />
          {/* <Route path='/events_create' element={ // Кто может создавать события?
              <ProtectedRoute allowedRoles={['admin', 'moderator', 'teacher']}> // Пример
                  <PageLayout><Events_create /></PageLayout>
              </ProtectedRoute>
          } /> */}
           <Route path='/events_create' element={<PageLayout><Events_create /></PageLayout>} /> {/* Оставил пока без защиты для примера */}


           <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PageLayout>
              <AdminDashboardLayout />
            </PageLayout>
          </ProtectedRoute>
        }>
          

          {/* События */}
          <Route path="events" element={<AdminEventsListPage />} />
          <Route path="events/new" element={<AdminEventFormPage />} />
          <Route path="events/:eventId/edit" element={<AdminEventFormPage />} />

          {/* Факультеты */}
          <Route path="faculties" element={<AdminFacultiesListPage />} />
          <Route path="faculties/new" element={<AdminFacultyFormPage />} />
          <Route path="faculties/:facultyId/edit" element={<AdminFacultyFormPage />} />
          <Route path="moderation/events" element={<EventModerationPage />} />

          {/* Отзывы */}
          <Route path="feedbacks" element={<AdminFeedbacksListPage />} />


            {/* Раздел Локации */}
            <Route path="locations" element={<AdminLocationsListPage />} />
            <Route path="locations/new" element={<AdminLocationFormPage />} />
            <Route path="locations/:locationId/edit" element={<AdminLocationFormPage />} />

        </Route>
          <Route path='/moderation' element={
            <ProtectedRoute allowedRoles={['admin', 'moderator']}>
              <PageLayout>
                <ModerationPage /> 
              </PageLayout>
            </ProtectedRoute>
          } />

           {/* --- Можно добавить маршрут для неавторизованного доступа --- */}
           {/* <Route path='/unauthorized' element={<PageLayout><h1>Доступ запрещен</h1></PageLayout>} /> */}

           {/* --- Маршрут 404 (если ничего не совпало) --- */}
           {/* <Route path="*" element={<PageLayout><NotFoundPage /></PageLayout>} /> */}

        </Routes>
      </div>
    </div>
  );
}

export default App;
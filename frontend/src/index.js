import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Layout from './pages/Layout';
import DetailNote from './notes/DetailNote';
import AddNote from './notes/AddNote';
import EditNote from './notes/EditNote';
import DeleteNote from './notes/DeleteNote';
import { AuthProvider } from './context/AuthContext';
import RedirectIfAuth from './components/RedirectIfAuth';
import RedirectIfNotAuth from './components/RedirectIfNotAuth';
import WildcardRedirect from './components/WildcardRedirect';

const root = ReactDOM.createRoot(document.getElementById("root")); 

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="*" element={<WildcardRedirect />} />
          <Route path="/" element={<RedirectIfAuth><Home /></RedirectIfAuth>} />
          <Route path="/registration/" element={<RedirectIfAuth><Registration /></RedirectIfAuth>} />
          <Route path="/login/" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/notes/" element={<RedirectIfNotAuth><Layout /></RedirectIfNotAuth>} >
            <Route index element={<App />} />
            <Route path=":pk/" element={<DetailNote />}/>
            <Route path="create/" element={<AddNote />} />
            <Route path="edit/:pk/" element={<EditNote />} />
            <Route path="delete/:pk/" element={<DeleteNote />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
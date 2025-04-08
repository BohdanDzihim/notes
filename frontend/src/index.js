import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Login from './Login';
import Registration from './Registration';
import DetailNote from './DetailNote';
import AddNote from './AddNote';
import EditNote from './EditNote'
import DeleteNote from './DeleteNote';
import Layout from './Layout';

const root = ReactDOM.createRoot(document.getElementById("root")); 
// const API = "http://127.0.0.1:8000/api/"; //uncomment by local dev
const API = process.env.REACT_APP_API_URL + "api/"; // comment by local dev

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration API={API} />} />
        <Route path="/login" element={<Login API={API} />} />
        <Route path="/notes" element={<Layout API={API} />} >
          <Route index element={<App />} />
          <Route path=":pk" element={<DetailNote />}/>
          <Route path="create" element={<AddNote API={API} />} />
          <Route path="edit/:pk" element={<EditNote API={API} />} />
          <Route path="delete/:pk" element={<DeleteNote API={API} />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
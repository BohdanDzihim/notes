import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Login from "./Login";
import Registration from "./Registration";
import DetailNote from "./DetailNote";
import AddNote from "./AddNote";
import EditNote from "./EditNote"
import DeleteNote from "./DeleteNote";
import Layout from "./Layout";

const root = ReactDOM.createRoot(document.getElementById("root")); 

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={<Layout />} >
          <Route index element={<App />} />
          <Route path=":pk" element={<DetailNote />}/>
          <Route path="create" element={<AddNote />} />
          <Route path="edit/:pk" element={<EditNote />} />
          <Route path="delete/:pk" element={<DeleteNote />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
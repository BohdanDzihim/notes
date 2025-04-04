import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const NOTES_API_URL = "http://127.0.0.1:8000/api/notes";

const Layout = () => {
  const [totalNotes, setTotalNotes] = useState(0);
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isNotesRoot = location.pathname === "/notes";

  useEffect(() => {
    const fetchNotes = () => {
      const params = new URLSearchParams();

      const limit = sessionStorage.getItem("limit");
      const offset = sessionStorage.getItem("offset");

      if (limit) params.append("limit", limit);
      if (offset) params.append("offset", offset);

      axios
        .get(params ? `${NOTES_API_URL}?${params.toString()}` : `${NOTES_API_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setNotes(response.data.results))
        .catch((error) => {
          console.error("Error fetching notes:", error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("accessToken");
            navigate("/");
          }
        });
    };

    if (!token) {
      navigate("/");
    } else {
      fetchNotes();
    }
  }, [token, navigate, location.key]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isNotesRoot={isNotesRoot}
      />
      <div 
        className="relative flex-1 flex overflow-hidden"
      >
        <div
          className={`
            absolute left-0 h-full bg-stone-100 z-30 shadow-lg
            transition-transform duration-300 ease-in-out max-w-full
            ${sidebarOpen || isNotesRoot ? "translate-x-0" : "-translate-x-full"}
            overflow-y-auto lg:relative lg:translate-x-0 lg:h-auto
          `}
        >
          <Sidebar 
            notes={notes}
            setNotes={setNotes}
            totalNotes={totalNotes}
            setTotalNotes={setTotalNotes}
          />
        </div>
        {(sidebarOpen && !isNotesRoot) && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
          />
        )}
        <main className="flex-1 p-2 overflow-auto lg:p-4">
          <Outlet />
        </main>
      </div>
      <Footer totalNotes={totalNotes} />
    </div>
  )
}

export default Layout
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ( {API} ) => {
  const [totalNotes, setTotalNotes] = useState(0);
  const [notes, setNotes] = useState([]);
  const [limit, setLimit] = useState(() => Number(sessionStorage.getItem("limit")) || 10);
  const [offset, setOffset] = useState(() => Number(sessionStorage.getItem("offset")) || 0);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isNotesRoot = location.pathname === "/notes";
  
  const fetchNotes = useCallback(async() => {
    try {
      const params = new URLSearchParams();
      params.append("limit", limit);
      params.append("offset", offset);
      sessionStorage.setItem("limit", limit);
      sessionStorage.setItem("offset", offset);

      const response = await axios.get(params ? `${API}notes?${params.toString()}` : `${API}notes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(response.data.results);
      setTotalNotes(response.data.count);
    } catch(error) {
      console.error("Error fetching notes:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };
  }, [API, limit, offset, token, navigate])
  
  useEffect(() => {
    if (token) fetchNotes();
  }, [fetchNotes, token]);

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
            API={API}
            notes={notes}
            setNotes={setNotes}
            totalNotes={totalNotes}
            setTotalNotes={setTotalNotes}
            fetchNotes={fetchNotes}
            limit={limit}
            setLimit={setLimit}
            offset={offset}
            setOffset={setOffset}
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
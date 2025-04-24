import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import api from '../hooks/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const [totalNotes, setTotalNotes] = useState(0);
  const [notes, setNotes] = useState([]);
  const [limit, setLimit] = useState(() => Number(sessionStorage.getItem("limit")) || 10);
  const [offset, setOffset] = useState(() => Number(sessionStorage.getItem("offset")) || 0);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isNotesRoot = location.pathname === "/notes/";
  const { setIsAuthenticated } = useContext(AuthContext);
  const isRefreshing = useRef(false);

  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    sessionStorage.setItem("limit", limit);
    sessionStorage.setItem("offset", offset);

    try {
      const response = await api.get(`notes/?${params.toString()}`);
      setNotes(response.data.results);
      setTotalNotes(response.data.count);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        if (!isRefreshing.current) {
          isRefreshing.current = true;
          try {
            await api.post("token/refresh/");
            const retry = await api.get(`notes/?${params.toString()}`);
            setNotes(retry.data.results);
            setTotalNotes(retry.data.count);
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem("username");
            setIsAuthenticated(false);
            navigate("/");
          } finally {
            isRefreshing.current = false;
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [limit, offset, navigate, setIsAuthenticated]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
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
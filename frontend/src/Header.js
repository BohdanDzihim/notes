import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SlLogout } from 'react-icons/sl';
import { FaMobile, FaTablet, FaLaptop } from 'react-icons/fa';
import useWindowSize from './hooks/useWindowSize';
import { FaBars } from 'react-icons/fa';

const Header = ({ sidebarOpen, setSidebarOpen, isNotesRoot }) => {
  const { width } = useWindowSize();
  const navigate = useNavigate();

  return (
    <header>
      {isNotesRoot ? <span></span> : <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden z-20 bg-transparent text-black p-2"
      >
        <FaBars />
      </button>}
      <a href="/notes">Notes App</a>
      <button
          className="pointer bg-transparent border-none text-2xl p-2 m-0 transition ease-in-out duration-200 hover:scale-110"
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("username");
            navigate("/");
          }}
        >
          <SlLogout />
        </button>
        <div className="grow"></div>
        <div className="justify-end mr-4">{width < 640 ? <FaMobile /> : width < 768 ? <FaTablet /> : <FaLaptop />}</div>
    </header>
  )
}

export default Header;
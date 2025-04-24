import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import api from '../hooks/api';

const FilterNotes = ({ setNotes, setTotalNotes }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState("");

  const handleSearch = async(e, search, date) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (date) params.append("date", date);

    if (params) {
      try {
        const response = await api.get(`notes/?${params.toString()}`);
        setNotes(response.data.results);
        setTotalNotes(response.data.count);
        navigate(`/notes/?${params}`);
      } catch(err) {
        console.error(err);
      }
    }
  }
  
  return (
    <>
      <form aria-label="search">
        <span className="w-full flex flex-row items-center gap-2 mt-4">
          <input 
            className="w-full p-2 border border-blue-600 border-2 rounded-md"
            type="text" 
            name="search"
            placeholder="Search Notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={(e) => handleSearch(e, search, date)} className="flex justify-center items-center h-6 w-8 bg-white rounded-md pointer text-xl p-2 border-2 border-blue-600 transition ease-in-out duration-200 hover:scale-110"><FaSearch /></button>
        </span>
        <span className="w-80 max-w-full flex flex-column items-center gap-2 mt-4">
          <label htmlFor="filter_date" className="flex w-full text-lg gap-2 items-center font-semibold"><FaCalendarAlt />Filter by date</label>
          <select 
            className="w-full p-1 border border-blue-600 border-2 rounded-md"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">All time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_week">Last 7 days</option>
            <option value="last_month">Last 30 days</option>
          </select>
        </span>
      </form>
    </>
  )
}

export default FilterNotes
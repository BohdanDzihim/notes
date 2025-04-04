import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ setNotes, totalNotes, setTotalNotes }) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalNotes / limit);
  const currentpage = Math.floor(offset / limit) + 1;

  const fetchNotes = useCallback(async() => {
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);
    sessionStorage.setItem("limit", limit);
    sessionStorage.setItem("offset", offset);

    const response = await fetch(`http://127.0.0.1:8000/api/notes?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const data = await response.json();
    setTotalNotes(data.count);
    setNotes(data.results);
  }, [token, limit, offset, setNotes, setTotalNotes]);

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchNotes({ limit, offset });
    }
  }, [token, limit, offset, navigate, fetchNotes]);

  const goToPage = (page) => {
    const newOffset = (page - 1) * limit;
    setOffset(newOffset);
  }

  return (
    <>
      <span className="flex gap-2 justify-center mb-1 -mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentpage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border'
            }`}
          >
            {i + 1}
          </button>
        ))}

      </span>
      <span>Showing {Math.min(offset + 1, totalNotes)}-{Math.min(offset + limit, totalNotes)} of {totalNotes} notes</span>
      <span className="w-full flex flex-column items-center gap-2">
        <label htmlFor="pagination" className="flex w-full text-lg gap-2 items-center font-semibold">Notes per page: </label>
        <select 
          className="p-1 border border-blue-600 border-2 rounded-md"
          name="limit" 
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </span>
    </>
  )
}

export default Pagination
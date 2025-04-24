import React from 'react';

const Pagination = ({ totalNotes, limit, setLimit, offset, setOffset }) => {
  const totalPages = Math.ceil(totalNotes / limit);
  const currentpage = Math.floor(offset / limit) + 1;

  const goToPage = (page) => {
    const newOffset = (page - 1) * limit;
    setOffset(newOffset);
  };

  return (
    <>
      {totalPages > 0 && <>
        <span className="flex gap-2 justify-center mb-1 -mt-4">
        <button className="px-3 py-1 rounded bg-white border" disabled={currentpage === 1} onClick={() => goToPage(currentpage - 1)}>Previous</button>
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
        <button className="px-3 py-1 rounded bg-white border" disabled={currentpage === totalPages} onClick={() => goToPage(currentpage + 1)}>Next</button>
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
      </>}
    </>
  )
}

export default Pagination
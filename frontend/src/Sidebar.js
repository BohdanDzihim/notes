import React from 'react';
import NotesList from './NotesList';
import FilterNotes from './FilterNotes';
import Pagination from './Pagination';

const Sidebar = ({ API, notes, setNotes, totalNotes, setTotalNotes, fetchNotes, limit, setLimit, offset, setOffset }) => {
  return (
    <>
      <aside>
        <h1 className="text-4xl font-bold">Hello, {localStorage.getItem("username")}</h1>
        <FilterNotes 
          API={API}
          setNotes={setNotes} 
          setTotalNotes={setTotalNotes} 
        />
        <NotesList 
          notes={notes}
        />
        <Pagination
          totalNotes={totalNotes} 
          fetchNotes={fetchNotes}
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          setOffset={setOffset}
        />
      </aside>
    </>
  )
}

export default Sidebar
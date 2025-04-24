import React from 'react';
import NotesList from './NotesList';
import FilterNotes from '../notes/FilterNotes';
import Pagination from '../notes/Pagination';

const Sidebar = ({ notes, setNotes, totalNotes, setTotalNotes, limit, setLimit, offset, setOffset }) => {
  return (
    <>
      <aside>
        <h1 className="text-4xl font-bold">Hello, {localStorage.getItem("username")}</h1>
        <FilterNotes 
          setNotes={setNotes} 
          setTotalNotes={setTotalNotes} 
        />
        <NotesList 
          notes={notes}
        />
        <Pagination
          totalNotes={totalNotes} 
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
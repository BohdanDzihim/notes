import React from 'react';
import NotesList from './NotesList';
import FilterNotes from "./FilterNotes";
import Pagination from './Pagination';

const Sidebar = ({ notes, setNotes, totalNotes, setTotalNotes }) => {
  return (
    <>
      <aside>
        <h1 className="text-4xl font-bold">Hello, {localStorage.getItem('username')}</h1>
        <FilterNotes 
          setNotes={setNotes} 
          setTotalNotes={setTotalNotes} 
        />
        <NotesList 
          notes={notes}
        />
        <Pagination 
          setNotes={setNotes} 
          totalNotes={totalNotes} 
          setTotalNotes={setTotalNotes}
        />
      </aside>
    </>
  )
}

export default Sidebar
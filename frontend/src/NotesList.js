import React from 'react';
import LineNote from './LineNote';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotesList = ({ notes }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/notes/create/')
  }

  return (
    <>
      <button type="button" className="flex items-center border border-black h-8 text-xl gap-2 mt-2 mb-4 text-white bg-green-600 p-2 rounded-md font-bold transition duration-300 ease-in-out hover:bg-green-700" onClick={handleClick}><FaPlus />Add Note</button>
      <ul>
        {notes.length ? notes.map((note) => (
          <LineNote
            key={note.id}
            note={note}
          />
        )) : (
          <p className="mb-4">You don't have notes</p>
        )}
      </ul>
    </>
  )
}

export default NotesList
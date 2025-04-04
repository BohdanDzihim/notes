import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const LineNote = ({ note }) => {
  return (
    <li className="flex text-2xl mb-4 justify-between">
      <Link className="transition duration-300 ease-in-out hover:bg-blue-50" to={`/notes/${note.id}`} state={{note}}>{note.title.length > 20 ? note.title.slice(0, 15) + "..." : note.title}</Link>
      <span className="flex gap-2">
        <Link className="hover:text-stone-600" to={`/notes/edit/${note.id}`} state={{note}}><FaEdit /></Link>
        <Link className="hover:text-red-600" to={`/notes/delete/${note.id}`} state={{note}}><FaTrashAlt /></Link>
      </span>
    </li>
  )
}

export default LineNote
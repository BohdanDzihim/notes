import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import QuillViewer from './QuillViewer';
import api from '../hooks/api';

const DeleteNote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const note = location.state?.note;

  const handleDelete = async(e) => {
    e.preventDefault();
    try {
      await api.delete(`notes/delete/${note.id}/`, { data: note });
      navigate("/notes/");
    } catch (error) {
      console.error("Error deliting note:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-0">
      <main className="flex-grow">
        <form onSubmit={handleDelete} aria-label="deleteNote">
          <h2 className="text-4xl font-bold mb-3 mt-4">Are you sure that you want to delete the note?</h2>
          <span className="m-1 text-2xl flex gap-2"><strong>Title:</strong>{note.title}</span>
          <QuillViewer
            content={note.content}
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="text-white font-semibold border-black p-3 border bg-red-600 rounded-md pointer shadow-md hover:bg-red-700 transition ease-in-out duration-200 text-2xl">Delete</button>
            <Link to="/notes/"><button className="text-white font-semibold bg-green-600 p-3 border border-black rounded-md shadow-md transition ease-in-out duration-200 hover:bg-green-700 text-2xl">No</button></Link>
          </div>
        </form>
      </main>
    </div>

  )
}

export default DeleteNote
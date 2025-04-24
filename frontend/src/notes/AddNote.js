import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Editor from './Editor';
import api from '../hooks/api';

const AddNote = () => {
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const addNote = async() => {
    try {
      await api.post(`notes/create/`, newNote);
      setNewNote({ title: "", content: "" });      
      navigate("/notes/");
    } catch(error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-0">
      <main className="flex-grow">
        <form aria-label="addNote" className="w-full">
          <input
            className="text-3xl p-3 mb-4 focus:outline-none focus:ring-0 focus:border-transparent"
            type="text"
            name="title"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <div className="mb-2">
            <Editor 
              name="content"
              placeholder="Content"
              api={api}
              value={newNote.content}
              onChange={(content) => setNewNote((prev) => ({ ...prev, content }))}
            />
          </div>
          <button type="button" className="border-black bg-blue-500 p-3 rounded-md text-2xl pointer max-w-xs hover:bg-blue-600 transition duration-200 ease-in-out" onClick={addNote}>Add Note</button>
        </form>
        <Link to="/notes/" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline text-sm mt-4"><FaArrowLeft className="mr-1" />Back to the notes</Link>
      </main>
    </div>
  )
}

export default AddNote
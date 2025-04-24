import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Editor from './Editor';
import api from '../hooks/api';

const EditNote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const note = location.state?.note;

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleEdit = async() => {
    try {
      await api.put(`notes/update/${note.id}/`, {title, content});
      setTitle("");
      setContent("");
      navigate("/notes/");
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-0">
      <main className="flex-grow">
        <form aria-label="editNote" className="w-full">
          <input 
            className="text-3xl p-2 mb-4 focus:outline-none focus:ring-0 focus:border-transparent"
            type="text" 
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="mb-2">
            <Editor
              name="content"
              placeholder="Content"
              value={content}
              onChange={(content) => setContent(content)}
            />
          </div>
          <button type="button" className="border-black border p-2 bg-blue-500 h-8 rounded-md text-2xl pointer max-w-xs hover:bg-blue-600 transition duration-200 ease-in-out" onClick={handleEdit}>Save</button>
        </form>
        <Link to="/notes/" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline text-sm mt-4"><FaArrowLeft className="mr-1" />Back to the notes</Link>
      </main>
    </div>
  )
}

export default EditNote
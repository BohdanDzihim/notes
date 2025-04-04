import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import QuillViewer from './QuillViewer';

const DetailNote = () => {
  const location = useLocation();
  const note = location.state?.note;

  if (!note) return <h2>Note not found</h2>

  return (
    <div className="flex flex-col min-h-0">
      <main className="flex-grow">
        <p className="text-4xl mt-4 mb-4">{note.title}</p>
        <QuillViewer
          content={note.content}
        />
        <Link to="/notes" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline text-sm mt-4"><FaArrowLeft className="mr-1" />Back to the notes</Link>
      </main>
    </div>
  )
}

export default DetailNote
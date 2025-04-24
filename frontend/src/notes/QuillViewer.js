import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';

const QuillViewer = ({ content }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        readOnly: true,
        modules: { toolbar: false },
      });

      quill.root.innerHTML = content;
    }
  }, [content]);

  return <div ref={editorRef} />;
};

export default QuillViewer;

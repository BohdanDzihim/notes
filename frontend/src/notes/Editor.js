import React, { useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../hooks/api';

const Editor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value || "");

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await api.post(`upload-image/`, formData);
        const imageUrl = response.data.image_url;
        setEditorValue((prev) => prev + `<img src="${imageUrl}" alt="uploaded image"/>`);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  }, []);

  const quillModules = {
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': [] }],
        [ 'bold', 'italic', 'underline', 'strike' ],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'super' }, { 'script': 'sub' }],
        [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
        [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
        [ 'direction', { 'align': [] }],
        [ 'link', 'image', 'formula' ],
        [ 'clean' ]
      ],
      handlers: {
        image: handleImageUpload
      }
    }

  };

  return (
    <div>
      <ReactQuill
        theme="snow" 
        placeholder="Content"
        modules={quillModules}
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
      />
    </div>
  )
}

export default Editor
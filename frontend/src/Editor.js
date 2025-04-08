import React, { useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = ({ API_BASE_URL, value, onChange }) => {
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
        const response = await fetch(`${API_BASE_URL}upload-image`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          timeout: 3000,
        });

        const data = await response.json();
        const imageUrl = data.image_url;

        setEditorValue((prev) => prev + `<img src="${imageUrl}" alt="uploaded image"/>`);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  }, [API_BASE_URL]);

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
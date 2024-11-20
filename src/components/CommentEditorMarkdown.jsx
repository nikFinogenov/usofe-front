import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

// Инициализация Markdown-it для рендеринга Markdown
const mdParser = new MarkdownIt();

const CommentEditor = ({ onSubmit }) => {
    const [value, setValue] = useState('');

    const handleEditorChange = ({ text }) => {
        setValue(text);
    };

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value); // Передаем введенный текст
            setValue('');    // Сбрасываем текст
        }
    };

    return (
        <div className="mt-2">
            <MarkdownEditor
                value={value}
                style={{ height: '200px' }}
                renderHTML={(text) => mdParser.render(text)} // Рендерим Markdown
                onChange={handleEditorChange}
                placeholder="Write your comment..."
            />
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Submit
            </button>
        </div>
    );
};

export default CommentEditor;
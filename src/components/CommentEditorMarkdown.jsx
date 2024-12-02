import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';


const mdParser = new MarkdownIt(
    {
        breaks: true, 
        gfm: true
    }
);

const CommentEditorMarkdown = ({ onSubmit, height, inputValue = null }) => {
    const [value, setValue] = useState(inputValue ? inputValue : '');

    
    const formatText = (text) => {
        return text;
    };

    const handleEditorChange = ({ text }) => {
        setValue(text);  
    };

    const handleSubmit = () => {
        if (value.trim()) {
            const formattedText = formatText(value);  
            onSubmit(formattedText); 
            setValue('');    
        }
    };

    return (
        <div className="mt-2">
            <MarkdownEditor
                value={value}
                style={{ height: height }}
                renderHTML={(text) => mdParser.render(text)} 
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

export default CommentEditorMarkdown;

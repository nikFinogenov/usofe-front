import React, { useState, useEffect } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import 'prismjs/themes/prism-tomorrow.css'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypePrism from 'rehype-prism-plus';

const CommentEditor = ({ onSubmit, height, inputValue = '' }) => {
    const [value, setValue] = useState(inputValue);

    const handleEditorChange = ({ text }) => {
        setValue(text);
    };

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value); 
            setValue(''); 
        }
    };

    const renderMarkdownPreview = (text) => {
        return (
            <div className="prose break-words mbl:break-all">
                <ReactMarkdown
                    children={text}
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[
                        [
                            rehypePrism,
                            {
                                ignoreMissing: true, 
                                defaultLanguage: 'plaintext', 
                            },
                        ],
                    ]}
                />
            </div>
        );
    };

    
    useEffect(() => {
        
        const preElements = document.querySelectorAll('pre');
        
        preElements.forEach((pre) => {
            
            if (!pre.classList.length) {
                pre.classList.add('language-plaintext');
            }
        });
    }, [value]); 

    return (
        <div className="mt-2">
            <MarkdownEditor
                value={value}
                style={{ height: height }}
                renderHTML={(text) => renderMarkdownPreview(text)} 
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

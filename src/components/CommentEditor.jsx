import React, { useState, useEffect } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import 'prismjs/themes/prism-tomorrow.css'; // Импорт темы подсветки
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
            onSubmit(value); // Передаем текст
            setValue(''); // Сбрасываем текст
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
                                ignoreMissing: true, // Игнорируем неизвестные языки
                                defaultLanguage: 'plaintext', // Язык по умолчанию
                            },
                        ],
                    ]}
                />
            </div>
        );
    };

    // useEffect для поиска элементов <pre> и добавления класса, если его нет
    useEffect(() => {
        // Находим все элементы <pre> на странице
        const preElements = document.querySelectorAll('pre');
        
        preElements.forEach((pre) => {
            // Если у элемента нет классов, добавляем language-plaintext
            if (!pre.classList.length) {
                pre.classList.add('language-plaintext');
            }
        });
    }, [value]); // Следим за изменениями текста

    return (
        <div className="mt-2">
            <MarkdownEditor
                value={value}
                style={{ height: height }}
                renderHTML={(text) => renderMarkdownPreview(text)} // Используем ReactMarkdown для превью
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

import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import rehypePrism from 'rehype-prism-plus'; // Импортируем плагин для подсветки
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';

// Инициализируем Markdown парсер
const mdParser = new MarkdownIt({
    breaks: true, // Включает поддержку переносов строк
    gfm: true, // Включает поддержку GFM (GitHub Flavored Markdown)
});

function MarkdownWithPreview({ content, handleEditorChange }) {
    // Функция для рендеринга с подсветкой синтаксиса
    const renderWithSyntaxHighlighting = (text) => {
        const htmlContent = mdParser.render(text);

        // Используем rehype для обработки HTML с подсветкой синтаксиса
        const processedContent = unified()
            .use(rehypeParse, { fragment: true })
            .use(rehypePrism) // Добавляем подсветку синтаксиса
            .use(rehypeStringify)
            .processSync(htmlContent);

        return String(processedContent);
    };

    return (
        <MarkdownEditor
            value={content}
            style={{ height: '500px' }}
            renderHTML={(text) => renderWithSyntaxHighlighting(text)} // Применяем рендер с подсветкой
            onChange={handleEditorChange}
            placeholder="Write your post content in markdown..."
        />
    );
}

export default MarkdownWithPreview;

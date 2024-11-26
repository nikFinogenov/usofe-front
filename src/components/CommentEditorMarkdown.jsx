import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

// Инициализация Markdown-it для рендеринга Markdown
const mdParser = new MarkdownIt();

const CommentEditorMarkdown = ({ onSubmit, height, inputValue = null }) => {
    const [value, setValue] = useState(inputValue ? inputValue : '');

    // Функция для добавления переноса строки в длинные строки текста, включая текст без пробелов
    const formatText = (text) => {
        // Заменяем ручные переносы каретки на видимые (опционально)
        text = text.replace(/\n/g, '\n');
    
        // Можно добавить другие предобработки, например, удаление лишних пробелов:
        text = text.trim(); // Убираем пробелы в начале и конце текста
    
        // Вернуть отформатированный текст
        return text;
    };

    const handleEditorChange = ({ text }) => {
        setValue(text);  // Обновляем состояние при изменении текста
    };

    const handleSubmit = () => {
        if (value.trim()) {
            const formattedText = formatText(value);  // Обрабатываем текст перед отправкой
            onSubmit(formattedText); // Передаем обработанный текст
            setValue('');    // Сбрасываем текст
        }
    };

    return (
        <div className="mt-2">
            <MarkdownEditor
                value={value}
                style={{ height: height }}
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

export default CommentEditorMarkdown;

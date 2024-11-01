// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onNext, onPrevious, onFirst, onLast }) => {
    return (
        <div className="flex justify-between items-center mt-6">
            <button 
                onClick={onFirst}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Супер Назад
            </button>
            <button 
                onClick={onPrevious}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Предыдущая
            </button>

            <span>{`Страница ${currentPage} из ${totalPages}`}</span>

            <button 
                onClick={onNext}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Следующая
            </button>
            <button 
                onClick={onLast}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Супер Вперёд
            </button>
        </div>
    );
};

export default Pagination;

// src/components/Pagination.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const navigate = useNavigate();

    const handlePageChange = (pageNumber) => {
        onPageChange(pageNumber);
        navigate(`?page=${pageNumber}`);
    };

    const renderButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 10;
        let startPage = Math.max(1, currentPage - 4);
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (endPage - startPage < maxVisibleButtons - 1) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        if (startPage > 1) {
            buttons.push(
                <button key={1} onClick={() => handlePageChange(1)} className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    1
                </button>
            );
            if (startPage > 2) buttons.push(<span key="ellipsis-start" className='mx-1 px-2 py-1 rounded bg-gray-300'>...</span>);
        }

        for (let page = startPage; page <= endPage; page++) {
            buttons.push(
                <button key={page} onClick={() => handlePageChange(page)} className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    {page}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) buttons.push(<span key="ellipsis-end" className='mx-1 px-2 py-1 rounded bg-gray-300'>...</span>);
            buttons.push(
                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    return <div className="mt-4 flex justify-center mb-5">{renderButtons()}</div>;
}

export default Pagination;

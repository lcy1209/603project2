import React from 'react';
import './css/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      // 총 페이지가 5개 이하면 모든 페이지를 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: 5 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav>
      <ul className="board-pagination">
        {currentPage > 1 && (
          <>
            <li className="board-page-item">
              <button className='page-arrows' onClick={() => onPageChange(1)}>
                «
              </button>
            </li>
            <li className="board-page-item">
              <button className='page-arrows' onClick={() => onPageChange(currentPage - 1)}>
                ‹
              </button>
            </li>
          </>
        )}

        {pageNumbers.map(number => (
          <li key={number} className="board-page-item">
            <button
              onClick={() => onPageChange(number)}
              style={{
                textDecoration: currentPage === number ? 'underline' : 'none',
                fontWeight: currentPage === number ? 'bold' : 'normal'
              }}
            >
              {number}
            </button>
          </li>
        ))}

        {currentPage < totalPages && (
          <>
            <li className="board-page-item">
              <button className='page-arrows' onClick={() => onPageChange(currentPage + 1)}>
                ›
              </button>
            </li>
            <li className="board-page-item">
              <button className='page-arrows' onClick={() => onPageChange(totalPages)}>
                »
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;

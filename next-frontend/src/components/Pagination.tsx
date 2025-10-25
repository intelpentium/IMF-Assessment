'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setInputPage(page.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="join">
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          « Prev
        </button>
        
        {startPage > 1 && (
          <>
            <button className="join-item btn" onClick={() => handlePageChange(1)}>
              1
            </button>
            {startPage > 2 && <span className="join-item btn btn-disabled">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            className={`join-item btn ${page === currentPage ? 'btn-active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="join-item btn btn-disabled">...</span>}
            <button className="join-item btn" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next »
        </button>
      </div>
      
      <div className="form-control w-full max-w-xs mt-4">
        <label className="label">
          <span className="label-text">Go to page</span>
        </label>
        <div className="flex">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-xs"
          />
          <button
            className="btn btn-primary ml-2"
            onClick={handleGoToPage}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
import React from "react";

export default function Pagination({
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
}) {
  return (
    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <span>Linhas por página:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            goToPage(1);
          }}
          className="mt-1 block pl-2 pr-8 py-1 text-sm border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {[5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-1 rounded-md ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )
          .map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`p-1 rounded-md ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

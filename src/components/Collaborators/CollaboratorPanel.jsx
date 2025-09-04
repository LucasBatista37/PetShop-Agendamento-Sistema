import React from "react";
import CollaboratorFilters from "./CollaboratorFilters";
import CardView from "./CardView";
import ListView from "./ListView";
import CollaboratorPagination from "./CollaboratorPagination";

export default function CollaboratorPanel({
  search,
  setSearch,
  view,
  setView,
  data,
  onDelete,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 border-b border-gray-100">
        <CollaboratorFilters
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
          total={data.length}
        />
      </div>

      <div className={view === "card" ? "p-4" : "pt-0"}>
        {view === "list" ? (
          <ListView data={data} onDelete={onDelete} />
        ) : (
          <CardView data={data} onDelete={onDelete} />
        )}
      </div>

      <CollaboratorPagination
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  );
}

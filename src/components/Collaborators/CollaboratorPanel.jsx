import React from "react";
import CollaboratorFilters from "./CollaboratorFilters";
import CardView from "./CardView";
import ListView from "./ListView";

export default function CollaboratorPanel({
  search,
  setSearch,
  view,
  setView,
  data,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 border-b border-gray-100">
        <CollaboratorFilters
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
        />
      </div>

      <div className={view === "card" ? "p-4" : "pt-2"}>
        {view === "list" ? (
          <ListView data={data} />
        ) : (
          <CardView data={data} />
        )}
      </div>
    </div>
  );
}

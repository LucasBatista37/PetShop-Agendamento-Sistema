import React, { useState, useMemo } from "react";
import { FaUserPlus } from "react-icons/fa";
import AddCollaboratorModal from "./AddCollaboratorModal";
import CollaboratorPanel from "./CollaboratorPanel";

export default function Collaborators() {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: "Lucas Batista",
      email: "lucas@email.com",
      role: "Administrador",
      department: "TI",
      status: "Ativo",
      joinedAt: "2025-06-01",
    },
    {
      id: 2,
      name: "Carla Souza",
      email: "carla@email.com",
      role: "Colaborador",
      department: "Agendamento",
      status: "Pendente",
      joinedAt: "2025-06-25",
    },
  ]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return collaborators.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }, [search, collaborators]);

  const handleAdd = (newCollaborator) => {
    setCollaborators((prev) => [...prev, newCollaborator]);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Colaboradores
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FaUserPlus /> Adicionar
          </button>
        </div>
      </header>

      <CollaboratorPanel
        search={search}
        setSearch={setSearch}
        view={view}
        setView={setView}
        data={filtered}
      />

      <AddCollaboratorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAdd}
      />
    </div>
  );
}

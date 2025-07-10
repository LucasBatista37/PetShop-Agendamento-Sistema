import React, { useEffect, useState, useMemo } from "react";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import AddCollaboratorModal from "./AddCollaboratorModal";
import CollaboratorPanel from "./CollaboratorPanel";

import PrimaryButton from "@/components/ui/PrimaryButton";

import {
  fetchCollaborators,
  inviteCollaborator,
  deleteCollaborator,
} from "@/api/api";

export default function Collaborators() {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    fetchCollaborators()
      .then((res) => {
        setCollaborators(res.data.collaborators);
      })
      .catch(() => toast.error("Erro ao carregar colaboradores"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return collaborators.filter((c) => {
      const name = c.name || "";
      const email = c.email || "";
      return (
        name.toLowerCase().includes(term) || email.toLowerCase().includes(term)
      );
    });
  }, [search, collaborators]);

  const handleAdd = async (data) => {
    try {
      await inviteCollaborator({
        email: data.email,
        department: data.department,
      });
      toast.success("Convite enviado com sucesso!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao enviar convite");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este colaborador?")) return;

    try {
      await deleteCollaborator(id);
      setCollaborators((prev) => prev.filter((c) => c._id !== id));
      toast.success("Colaborador excluído com sucesso!");
    } catch (err) {
      toast.error("Erro ao excluir colaborador");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Colaboradores
          </h1>
          <PrimaryButton
            onClick={() => setShowModal(true)}
            icon={FaUserPlus}
            color="indigo"
            fullWidth
          >
            Adicionar
          </PrimaryButton>
        </div>
      </header>

      {loading ? (
        <p className="text-gray-600">Carregando colaboradores...</p>
      ) : (
        <CollaboratorPanel
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
          data={filtered}
          onDelete={handleDelete}
        />
      )}

      <AddCollaboratorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAdd}
      />
    </div>
  );
}

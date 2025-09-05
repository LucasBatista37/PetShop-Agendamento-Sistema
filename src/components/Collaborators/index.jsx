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

const mapUserForUI = (u) => {
  const isVerified = !!u.isVerified;
  const pendingInvitation = !!u.pendingInvitation;
  const status = pendingInvitation ? "Pendente" : isVerified ? "Ativo" : "Inativo";

  return {
    _id: u._id,
    name: u.name || "",
    email: u.email || "",
    department: u.department || "",
    role: u.role || "collaborator",
    inviteAcceptedAt: u.inviteAcceptedAt || null,
    isVerified,
    pendingInvitation,
    status,
  };
};

export default function Collaborators() {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collaborators, setCollaborators] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCollaborators()
      .then((res) => {
        const items = (res.data.collaborators || []).map(mapUserForUI);
        setCollaborators(items);
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

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, currentPage, rowsPerPage]);

  const goToPage = (page) => setCurrentPage(page);
  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleAdd = async (data) => {
    try {
      const res = await inviteCollaborator({
        email: data.email,
        department: data.department,
      });

      toast.success("Convite enviado com sucesso!");
      setShowModal(false);

      if (res?.data?.invite) {
        const invite = res.data.invite;
        setCollaborators((prev) => [mapUserForUI({
          _id: invite._id || `inv_${Date.now()}`,
          name: invite.name || "",
          email: invite.email,
          department: invite.department,
          role: "collaborator",
          inviteAcceptedAt: null,
          isVerified: false,
          pendingInvitation: true,
        }), ...prev]);
      } else {
        const temp = {
          _id: `inv_${Date.now()}`,
          name: data.name || "",
          email: data.email,
          department: data.department || "",
          role: "collaborator",
          inviteAcceptedAt: null,
          isVerified: false,
          pendingInvitation: true,
          status: "Pendente",
        };
        setCollaborators((prev) => [temp, ...prev]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao enviar convite");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este colaborador?")) return;

    try {
      if (String(id).startsWith("inv_")) {
        setCollaborators((prev) => prev.filter((c) => c._id !== id));
      } else {
        await deleteCollaborator(id);
        setCollaborators((prev) => prev.filter((c) => c._id !== id));
      }

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
        <>
          <CollaboratorPanel
            search={search}
            setSearch={setSearch}
            view={view}
            setView={setView}
            data={paginatedData}
            onDelete={handleDelete}
            rowsPerPage={rowsPerPage} 
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </>
      )}

      <AddCollaboratorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAdd}
      />
    </div>
  );
}

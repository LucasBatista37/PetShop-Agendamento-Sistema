import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import EditServiceModal from "./EditServiceModal";
import { fetchServices, deleteService, updateService } from "@/api/api";

export default function ServicesConfig() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchServices()
      .then((res) => setServices(res.data))
      .catch(() => setError("Erro ao carregar serviços"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este serviço?")) return;
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Erro ao excluir serviço");
    }
  };

  const handleSaveEdit = async (updated) => {
    setEditError("");
    try {
      const res = await updateService(updated._id, updated);
      setServices((prev) =>
        prev.map((s) => (s._id === updated._id ? res.data : s))
      );
      setEditData(null);
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Erro ao atualizar serviço";
      setEditError(errorMsg);
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">Serviços</h1>
        <Link
          to="/services/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <FaPlus /> Novo Serviço
        </Link>
      </header>

      {services.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum serviço cadastrado.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <ServiceCard
              key={s._id}
              service={s}
              onDelete={() => handleDelete(s._id)}
              onEdit={() => {
                setEditData(s);
                setEditError("");
              }}
            />
          ))}
        </div>
      )}

      {editData && (
        <EditServiceModal
          service={editData}
          onClose={() => setEditData(null)}
          onSave={handleSaveEdit}
          error={editError}
        />
      )}
    </div>
  );
}

// ✅ ServiceCard revisado COM TRUNCATE + TOOLTIP + CSS básico
function ServiceCard({ service, onDelete, onEdit }) {
  // Função para truncar texto JS
  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <div>
        <h3
          className="text-lg font-semibold text-gray-800"
          title={service.name}
        >
          {service.name}
        </h3>
        <p
          className="mt-1 text-sm text-gray-600 overflow-hidden break-words"
          title={service.description}
        >
          {truncate(service.description, 150)}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-indigo-600">
          R$ {service.price.toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          <button
            title="Editar"
            onClick={onEdit}
            className="text-indigo-500 hover:text-indigo-700 text-sm"
          >
            ✏️
          </button>
          <button
            title="Excluir"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

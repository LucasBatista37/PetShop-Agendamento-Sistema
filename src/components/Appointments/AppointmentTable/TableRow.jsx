import React from "react";
import IconButton from "../IconButton";
import { FaEye, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { formatInTimeZone } from "date-fns-tz";

export default function TableRow({
  appointment,
  index,
  onEdit,
  onDelete,
  onStatusChange,
  setSelected,
  statusMenuOpen,
  setStatusMenuOpen,
}) {
  const {
    _id,
    petName,
    ownerName,
    ownerPhone,
    baseService,
    extraServices = [],
    date,
    time,
    price,
    status,
  } = appointment;

  const statusClass =
    {
      Confirmado: "bg-blue-100 text-blue-700",
      Pendente: "bg-yellow-100 text-yellow-700",
      Cancelado: "bg-red-100 text-red-700",
      Finalizado: "bg-green-100 text-green-700",
    }[status] || "bg-gray-100 text-gray-700";

  const baseServiceName =
    typeof baseService === "object" ? baseService?.name : "—";
  const extraServiceNames =
    Array.isArray(extraServices) &&
    extraServices
      .map((e) => (typeof e === "object" ? e.name : ""))
      .filter(Boolean)
      .join(", ");

  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
      <td className="px-4 py-2 font-medium text-gray-800" title={petName}>
        {truncate(petName, 10)}
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <span className="text-sm text-gray-800" title={ownerName}>
            {truncate(ownerName, 15)}
          </span>
          <span className="text-xs text-gray-400">{ownerPhone}</span>
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-col">
          <span className="text-sm text-gray-800" title={baseServiceName}>
            {truncate(baseServiceName, 30) || "—"}
          </span>
          {extraServiceNames && (
            <span className="text-xs text-gray-500" title={extraServiceNames}>
              Extras: {truncate(extraServiceNames, 40)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-2 text-sm text-gray-800 hidden sm:table-cell">
        {formatInTimeZone(date, "UTC", "dd/MM/yyyy")} às {time}
      </td>
      <td className="px-4 py-2 text-sm text-gray-800 hidden lg:table-cell">
        {price ? `R$ ${price}` : "—"}
      </td>
      <td className="px-4 py-2">
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-2">
        <div className="relative inline-flex items-center gap-2">
          <IconButton
            title="Visualizar"
            onClick={() => setSelected(appointment)}
            icon={FaEye}
            className="text-gray-600 hover:text-indigo-600"
          />
          <IconButton
            title="Editar"
            onClick={() => onEdit(appointment)}
            icon={FaEdit}
            className="text-blue-600 hover:text-blue-800"
          />
          <IconButton
            title="Excluir"
            onClick={() => onDelete(_id)}
            icon={FaTrash}
            className="text-red-600 hover:text-red-800"
          />
          <div className="relative">
            <IconButton
              title="Alterar Status"
              onClick={() =>
                setStatusMenuOpen((open) => (open === _id ? null : _id))
              }
              icon={FaEllipsisV}
              className="text-gray-600 hover:text-gray-900"
            />
            {statusMenuOpen === _id && (
              <div className="absolute z-10 right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg">
                {["Pendente", "Confirmado", "Finalizado", "Cancelado"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => {
                        onStatusChange(_id, option);
                        setStatusMenuOpen(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

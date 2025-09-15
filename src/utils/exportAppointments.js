import * as XLSX from "xlsx";
import { notifySuccess, notifyError } from "./Toast";

export function exportCSV(appointments, filename = "agendamentos.csv") {
  if (appointments.length === 0) {
    notifyError("Nenhum agendamento para exportar.");
    return;
  }

  const headers = [
    "Pet",
    "Dono",
    "Telefone",
    "Serviço Base",
    "Serviços Extras",
    "Data",
    "Hora",
    "Status",
    "Notas",
  ];

  const rows = appointments.map((a) => [
    a.petName,
    a.ownerName,
    a.ownerPhone,
    a.baseService?.name || a.baseService || "-",
    a.extraServices?.map((e) => e.name || e).join(", ") || "-",
    a.date,
    a.time,
    a.status,
    a.notes || "-",
  ]);

  const csv =
    [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n") + "\n";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  notifySuccess("Exportação CSV concluída!");
}

export function exportXLSX(appointments, filename = "agendamentos.xlsx") {
  if (appointments.length === 0) {
    notifyError("Nenhum agendamento para exportar.");
    return;
  }

  const aoa = [
    [
      "Pet",
      "Dono",
      "Telefone",
      "Serviço Base",
      "Serviços Extras",
      "Data",
      "Hora",
      "Status",
      "Notas",
    ],
    ...appointments.map((a) => [
      a.petName,
      a.ownerName,
      a.ownerPhone,
      a.baseService?.name || a.baseService || "-",
      a.extraServices?.map((e) => e.name || e).join(", ") || "-",
      a.date,
      a.time,
      a.status,
      a.notes || "-",
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Agendamentos");
  XLSX.writeFile(wb, filename);

  notifySuccess("Exportação Excel concluída!");
}

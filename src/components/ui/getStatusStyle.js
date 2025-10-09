export default function getStatusStyle(statusRaw) {
  const s = (statusRaw || "").toLowerCase();

  if (["finalizado", "concluído", "concluido"].some(k => s.includes(k))) {
    return {
      track: "bg-emerald-100",
      grad: "from-emerald-500 to-emerald-400",
      pillBg: "bg-emerald-50",
      pillText: "text-emerald-700",
      pillBorder: "border-emerald-200",
      label: "Concluído",
    };
  }
  if (s.includes("pendente")) {
    return {
      track: "bg-amber-100",
      grad: "from-amber-500 to-amber-400",
      pillBg: "bg-amber-50",
      pillText: "text-amber-700",
      pillBorder: "border-amber-200",
      label: "Pendente",
    };
  }
  if (s.includes("cancel")) {
    return {
      track: "bg-red-100",
      grad: "from-red-500 to-red-400",
      pillBg: "bg-red-50",
      pillText: "text-red-700",
      pillBorder: "border-red-200",
      label: "Cancelado",
    };
  }
  return {
    track: "bg-indigo-100",
    grad: "from-indigo-500 to-indigo-400",
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-700",
    pillBorder: "border-indigo-200",
    label: "Confirmado",
  };
}

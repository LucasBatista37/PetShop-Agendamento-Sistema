import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PetImageCard({ date = new Date(), imageSrc }) {
  const d = date instanceof Date ? date : new Date(date);

  const weekday = format(d, "EEEE", { locale: ptBR });
  const displayWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const displayDate = format(d, "dd/MM/yyyy");

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 h-64">
      <img src={imageSrc} alt="Pet" className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white text-lg font-semibold">{displayWeekday}</h3>
        <p className="text-white text-sm">{displayDate}</p>
      </div>
    </div>
  );
}

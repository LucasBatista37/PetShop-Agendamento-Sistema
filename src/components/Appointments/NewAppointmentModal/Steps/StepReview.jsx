import React from "react";
import { FaPaw, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function StepReview({ data }) {
  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-lg font-semibold text-gray-700">
        Resumo do Agendamento
      </h3>

      <div className="flex items-center gap-4 p-4 rounded-lg shadow-sm bg-indigo-50 hover:shadow-md transition">
        <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
          <FaPaw className="text-indigo-600 w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{data.pet.name}</p>
          <p className="text-gray-500 text-sm">{data.pet.species}</p>
        </div>
      </div>

      <div className="flex items-start gap-4 p-4 rounded-lg shadow-sm bg-green-50 hover:shadow-md transition">
        <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
          <FaClipboardList className="text-green-600 w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800">
            {data.service.base?.name || "Serviço não selecionado"}
          </p>
          {data.service.extras.length > 0 && (
            <ul className="text-gray-500 text-sm list-disc list-inside mt-1">
              {data.service.extras.map((e) => (
                <li key={e.name}>{e.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-lg shadow-sm bg-yellow-50 hover:shadow-md transition">
        <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
          <FaCalendarAlt className="text-yellow-600 w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {data.schedule.date
              ? format(parseISO(data.schedule.date), "dd/MM/yyyy", {
                  locale: ptBR,
                })
              : "Data não selecionada"}{" "}
            às {data.schedule.time}
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Dialog } from "@headlessui/react";
import {
  FaPhoneAlt,
  FaTimes,
  FaWhatsapp,
  FaEnvelope,
  FaSms,
  FaCheckCircle,
} from "react-icons/fa";

export default function AppointmentDetails({ open, onClose, data }) {
  if (!data) return null;

  const {
    petName,
    ownerName,
    phone,
    species = "",
    breed = "",
    service,
    extras = [],
    price,
    status,
    notes,
    date,
    time,
  } = data;

  const statusInfo = {
    Confirmado: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      label: "Confirmado",
    },
    Pendente: { bg: "bg-amber-100", text: "text-amber-600", label: "Pendente" },
    Cancelado: { bg: "bg-rose-100", text: "text-rose-600", label: "Cancelado" },
  }[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 z-40" aria-hidden="true" />

      <Dialog.Panel className="relative z-50 ml-auto w-full max-w-md h-full bg-white flex flex-col shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur border-b">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {formatDate(date)} • {time}
            </h3>
            <span
              className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-6 space-y-6 text-sm">
          <Section title="Informações do pet">
            <Item
              icon="🐾"
              label={`${petName} (${species}${breed ? `, ${breed}` : ""})`}
            />
            <Item icon="👤" label={ownerName} />
            <Item icon={<FaPhoneAlt />} label={phone} />
          </Section>

          <Section title="Serviço">
            <span
              className={`inline-block px-2 py-1 rounded ${statusInfo.bg} ${statusInfo.text}`}
            >
              {service}
            </span>
            {extras?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {extras.map((e) => (
                  <span
                    key={e}
                    className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs"
                  >
                    {e}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {notes && (
            <Section title="Observações">
              <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
            </Section>
          )}

          <p className="text-right font-semibold text-indigo-700">
            Valor: {price}
          </p>
        </div>

        <footer className="px-6 py-4 border-t flex flex-col gap-3">
          <div className="flex gap-2">
            <ActionButton Icon={FaSms} tooltip="SMS" color="bg-amber-500" />
            <ActionButton
              Icon={FaEnvelope}
              tooltip="Email"
              color="bg-sky-600"
            />
            <ActionButton
              Icon={FaWhatsapp}
              tooltip="WhatsApp"
              color="bg-emerald-500"
            />
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 flex items-center justify-center gap-2">
            <FaCheckCircle /> Finalizar
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
          >
            Fechar
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

const Section = ({ title, children }) => (
  <div>
    <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
    {children}
  </div>
);

const Item = ({ icon, label }) => (
  <p className="flex items-center gap-2 text-gray-700">
    {icon} <span>{label}</span>
  </p>
);

const ActionButton = ({ Icon, tooltip }) => (
  <button
    title={tooltip}
    className="flex-1 bg-gray-50 border border-gray-200 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-600"
  >
    <Icon />
  </button>
);

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
};
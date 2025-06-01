import React from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function AppointmentDetails({
  open,
  onClose,
  data,
  onFinalize,
}) {
  if (!data) return null;

  const {
    _id,
    petName,
    species,
    breed,
    size,
    notes,
    price,
    ownerName,
    ownerPhone,
    baseService,
    extraServices = [],
    date,
    time,
    status,
  } = data;

  const statusInfo = {
    Confirmado: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      label: "Confirmado",
    },
    Pendente: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      label: "Pendente",
    },
    Cancelado: {
      bg: "bg-rose-100",
      text: "text-rose-600",
      label: "Cancelado",
    },
    Finalizado: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      label: "Finalizado",
    },
  }[status] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: status,
  };

  const formatDate = (iso) => {
    try {
      return format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return iso;
    }
  };

  const phoneDigits = ownerPhone.replace(/\D/g, "");
  const whatsappNumber = phoneDigits.startsWith("55")
    ? phoneDigits
    : `55${phoneDigits}`;

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 z-40" aria-hidden="true" />

      <Dialog.Panel className="relative z-50 ml-auto w-full max-w-md h-full bg-white flex flex-col shadow-2xl">
        <header className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white/95 border-b">
          <div>
            <h3 className="font-semibold text-gray-800">
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
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
            aria-label="Fechar detalhes"
          >
            <FaTimes />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          <Section title="Informações do Pet">
            <Item
              icon="🐾"
              label={`${petName} (${species}${breed ? `, ${breed}` : ""})`}
            />
            <Item icon="📏" label={`Tamanho: ${size}`} />
          </Section>

          <Section title="Informações do Dono">
            <Item icon="👤" label={ownerName} />
            <Item icon={<FaWhatsapp />} label={ownerPhone} />
          </Section>

          <Section title="Serviço">
            <span
              className={`inline-block px-2 py-1 rounded ${statusInfo.bg} ${statusInfo.text}`}
            >
              {baseService?.name || "—"}
            </span>
            {extraServices.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {extraServices.map((e) => (
                  <span
                    key={e._id || e}
                    className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs"
                  >
                    {e.name || e}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {notes && (
            <Section title="Observações">
              <p className="whitespace-pre-wrap text-gray-700">{notes}</p>
            </Section>
          )}

          <p className="text-right font-semibold text-indigo-700">
            Valor:{" "}
            {price != null
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(price)
              : "—"}
          </p>
        </div>

        <footer className="px-6 py-4 border-t flex flex-col gap-3">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> WhatsApp
          </a>

          <button
            onClick={() => {
              onFinalize(_id);
              onClose();
            }}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <FaCheckCircle /> Finalizar
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import SupportMessageModal from "@/components/Help/SupportMessageModal";
import { helpTopics } from "@/data/helpData";

export default function HelpCenter() {
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = helpTopics.filter((c) =>
    `${c.title} ${c.desc}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Central&nbsp;de&nbsp;Ajuda
        </h1>
        <div className="mt-4 flex flex-wrap gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 min-w-[200px] bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Precisa de ajuda?"
            aria-label="Pesquisar na central de ajuda"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            <FiMessageSquare className="h-5 w-5" />
            Enviar mensagem
          </button>
        </div>
        <SupportMessageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <p className="col-span-full text-gray-500">
            Nenhum tópico encontrado.
          </p>
        )}

        {filtered.map(({ id, title, desc, icon: Icon, to }) => (
          <Link
            key={id}
            to={to}
            className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <Icon className="h-10 w-10 text-indigo-600 group-hover:scale-105 transition-transform" />
              <div>
                <h2 className="text-lg font-medium text-gray-800">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{desc}</p>
              </div>
            </div>
            <span className="mt-4 inline-block text-indigo-600 text-sm font-medium group-hover:underline">
              Saiba mais →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

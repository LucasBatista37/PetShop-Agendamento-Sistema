import { useParams, Link } from "react-router-dom";
import { helpTopics } from "@/data/helpData";

export default function HelpDetail() {
  const { slug } = useParams();
  const topic = helpTopics.find((t) => t.to.endsWith(slug));

  if (!topic) {
    return (
      <div className="p-6">
        <Link to="/help" className="text-indigo-600 hover:underline">
          ← Voltar
        </Link>
        <p className="mt-4 text-gray-500">Tópico não encontrado.</p>
      </div>
    );
  }

  const { title, desc, icon: Icon, details } = topic;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8 flex items-center gap-4">
        <Link to="/help" className="text-indigo-600 hover:underline">
          ← Voltar
        </Link>
        <div className="flex items-center gap-2">
          <Icon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
        </div>
      </header>

      <section className="prose max-w-none">
        <p>{desc}</p>

        {details && details.length > 0 ? (
          details.map(({ id, heading, content }) => (
            <article key={id} className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800">{heading}</h2>
              <p className="mt-2 text-gray-700">{content}</p>
            </article>
          ))
        ) : (
          <p className="mt-6 text-gray-500">
            Ainda não há informações detalhadas para este tópico.
          </p>
        )}
      </section>
    </div>
  );
}

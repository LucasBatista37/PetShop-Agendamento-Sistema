import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
          Bem-vindo ao PetCare
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-500">
          Use seu e-mail e senha para entrar na sua conta
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            E-mail
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="seu@exemplo.com"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Senha
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="rounded focus:ring-indigo-500 border-gray-300"
              />
              Lembrar-me
            </label>
            <a
              href="/esqueci-senha"
              className="text-sm text-indigo-600 hover:underline"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white
                     bg-indigo-600 hover:bg-indigo-700
                     focus:outline-none focus:ring-4 focus:ring-indigo-300
                     transition"
        >
          Entrar
        </button>
      </form>

      <div className="flex items-center my-8 gap-4">
        <hr className="flex-1 border-gray-300" />
        <span className="text-sm text-gray-500 whitespace-nowrap">
          ou entre com
        </span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <div className="flex justify-center gap-5">
        {[
          { src: "/google-icon.svg", alt: "Google" },
          { src: "/apple-icon.svg", alt: "Apple" },
        ].map(({ src, alt }) => (
          <button
            key={alt}
            className="w-11 h-11 flex items-center justify-center rounded-full
                       border border-gray-300 bg-white
                       hover:bg-gray-50 active:scale-95 transition"
          >
            <img src={src} alt={alt} className="w-5 h-5" />
          </button>
        ))}
      </div>

      <p className="mt-10 text-sm text-center text-gray-500">
        Não possui conta?{" "}
        <a
          href="/cadastro"
          className="text-indigo-600 font-medium hover:underline"
        >
          Cadastre-se
        </a>
      </p>
    </>
  );
}

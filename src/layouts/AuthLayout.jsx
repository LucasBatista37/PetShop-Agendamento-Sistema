import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-white flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md">
          <a href="/" className="flex items-center mb-10">
            <img
              src="/logo-pet.svg"
              alt="Logotipo PetCare"
              className="w-8 h-8"
            />
            <span className="ml-3 text-2xl font-bold text-gray-800">
              PetCare
            </span>
          </a>
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-500" />

        <div className="relative z-10 text-center px-8 max-w-sm">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Gerencie sua clínica e agendamentos.
          </h2>
          <p className="text-lg text-indigo-200 mb-8">
            Faça login para acessar seu painel PetCare e acompanhar clientes, pets e serviços.
          </p>

          <div className="inline-block bg-white rounded-2xl shadow-2xl overflow-hidden">
            <img
              src="/illustration-pet-dashboard.png"
              alt="Preview do painel"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

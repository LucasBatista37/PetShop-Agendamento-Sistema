import { Outlet } from "react-router-dom";
import LogoPetCare from "../assets/PetCare.png";
  
export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-white flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md">
          <a href="/" className="flex items-center mb-18">
            <img
              src={LogoPetCare}
              alt="Logotipo PetCare"
              className="h-16 w-auto object-contain"
            />
          </a>
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-500" />

        <div className="relative z-10 text-center px-8 max-w-sm">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Gerencie seus Agendamentos com Excelência.
          </h2>
          <p className="text-lg text-indigo-200 mb-8">
            Faça login para acessar seu painel PetCare e acompanhar clientes,
            pets e serviços.
          </p>
        </div>
      </div>
    </div>
  );
}

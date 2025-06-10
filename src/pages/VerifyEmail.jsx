import React from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Quase lá!</h1>
      <p className="mb-6 text-gray-600">
        Enviamos um link de ativação para seu e-mail. Por favor, verifique sua
        caixa de entrada e clique no botão do e-mail para continuar.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Voltar ao Login
      </button>
    </div>
  );
}
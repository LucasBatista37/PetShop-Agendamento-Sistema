import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerify() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        ✅ E-mail confirmado!
      </h1>
      <p className="mb-6 text-gray-600">
        Seu e-mail foi verificado com sucesso. Agora você pode fazer login.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Entrar Agora
      </button>
    </div>
  );
}
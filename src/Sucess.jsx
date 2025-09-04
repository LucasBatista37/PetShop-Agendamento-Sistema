import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Pagamento realizado com sucesso! Sua assinatura foi ativada.");
    navigate("/dashboard");
  }, []);

  return <div className="p-6">Pagamento aprovado!</div>;
}

// Cancel.jsx
export default function Cancel() {
  return <div className="p-6">Pagamento cancelado ou falhou.</div>;
}

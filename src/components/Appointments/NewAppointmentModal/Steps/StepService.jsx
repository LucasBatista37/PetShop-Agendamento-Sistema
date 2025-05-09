import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StepService({ data, onChange }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
      setLoading(false);
    };
    fetch();
  }, []);

  const bases = services.filter((s) => !s.extra);
  const extras = services.filter((s) => s.extra);

  const toggleExtra = (id) => {
    const isSelected = data.extras.some((e) => e._id === id);
    const updatedExtras = isSelected
      ? data.extras.filter((e) => e._id !== id)
      : [...data.extras, extras.find((e) => e._id === id)];

    onChange({
      ...data,
      extras: updatedExtras,
    });
  };

  if (loading) return <p>Carregando serviços...</p>;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Serviço Base</h3>
      {bases.map((b) => (
        <label key={b._id} className="flex items-center gap-2">
          <input
            type="radio"
            name="baseService"
            checked={data.base?._id === b._id}
            onChange={() => onChange({ ...data, base: b })}
          />
          {b.name}
        </label>
      ))}

      <h3 className="font-medium pt-4">Extras</h3>
      {extras.map((e) => (
        <label key={e._id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.extras.some((x) => x._id === e._id)}
            onChange={() => toggleExtra(e._id)}
          />
          {e.name}
        </label>
      ))}
    </div>
  );
}

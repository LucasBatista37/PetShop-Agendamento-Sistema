import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StepService({ data, onChange, errors = {} }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_LIMIT = 4;
  const EXTRAS_LIMIT = 6;

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

    onChange({ ...data, extras: updatedExtras });
  };

  if (loading) return <p>Carregando serviços...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-700 font-semibold mb-2">Serviço Base</h3>
        {errors.base && <p className="text-red-600 text-sm mb-1">{errors.base}</p>}
        <div
          className={`overflow-y-auto pr-1 rounded-md custom-scroll`}
          style={{ maxHeight: bases.length > BASE_LIMIT ? "13rem" : "none" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bases.map((b) => (
              <label
                key={b._id}
                className={`flex items-center gap-2 border p-2 rounded-md cursor-pointer transition ${
                  data.base?._id === b._id
                    ? "bg-blue-100 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="baseService"
                  checked={data.base?._id === b._id}
                  onChange={() => onChange({ ...data, base: b })}
                />
                <span>{b.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-gray-700 font-semibold mb-2">Serviços Extras</h3>

        <div
          className="custom-scroll overflow-y-auto pr-1 rounded-md"
          style={{
            maxHeight: extras.length > EXTRAS_LIMIT ? "240px" : "auto",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {extras.map((e) => {
              const isChecked = data.extras.some((x) => x._id === e._id);
              return (
                <label
                  key={e._id}
                  className={`flex items-center gap-2 border p-2 rounded-md cursor-pointer transition ${
                    isChecked
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleExtra(e._id)}
                  />
                  <span>{e.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
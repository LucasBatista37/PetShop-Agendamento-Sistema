import React from "react";

export default function StepPet({ data, onChange, errors = {} }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-gray-700 font-semibold">Informações do Pet</h3>

        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        <input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Nome do pet"
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            {errors.species && (
              <p className="text-red-600 text-sm">{errors.species}</p>
            )}
            <select
              value={data.species}
              onChange={(e) => onChange({ ...data, species: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option>Cachorro</option>
              <option>Gato</option>
            </select>
          </div>

          <div>
            {errors.size && (
              <p className="text-red-600 text-sm">{errors.size}</p>
            )}
            <select
              value={data.size}
              onChange={(e) => onChange({ ...data, size: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Selecione</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Medio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
        </div>

        <input
          value={data.breed}
          onChange={(e) => onChange({ ...data, breed: e.target.value })}
          placeholder="Raça (opcional)"
          className="w-full border p-2 rounded"
        />

        <textarea
          rows="3"
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Observações"
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-700 font-semibold">Informações do Dono</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {errors.ownerName && (
              <p className="text-red-600 text-sm">{errors.ownerName}</p>
            )}
            <input
              value={data.ownerName || ""}
              onChange={(e) => onChange({ ...data, ownerName: e.target.value })}
              placeholder="Nome do dono"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            {errors.ownerPhone && (
              <p className="text-red-600 text-sm">{errors.ownerPhone}</p>
            )}
            <input
              value={data.ownerPhone || ""}
              onChange={(e) =>
                onChange({ ...data, ownerPhone: e.target.value })
              }
              placeholder="Telefone do dono"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

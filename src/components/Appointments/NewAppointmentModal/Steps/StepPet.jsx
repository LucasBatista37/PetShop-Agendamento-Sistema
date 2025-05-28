import React from 'react';

export default function StepPet({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-gray-700 font-semibold">Informações do Pet</h3>
        <input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Nome do pet"
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={data.species}
            onChange={(e) => onChange({ ...data, species: e.target.value })}
            className="border p-2 rounded"
          >
            <option>Cachorro</option>
            <option>Gato</option>
          </select>

          <select
            value={data.size}
            onChange={(e) => onChange({ ...data, size: e.target.value })}
            className="border p-2 rounded"
          >
            <option>Pequeno</option>
            <option>Médio</option>
            <option>Grande</option>
          </select>
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
          <input
            value={data.ownerName || ""}
            onChange={(e) => onChange({ ...data, ownerName: e.target.value })}
            placeholder="Nome do dono"
            className="border p-2 rounded"
            required
          />
          <input
            value={data.ownerPhone || ""}
            onChange={(e) => onChange({ ...data, ownerPhone: e.target.value })}
            placeholder="Telefone do dono"
            className="border p-2 rounded"
            required
          />
        </div>
      </div>
    </div>
  );
}

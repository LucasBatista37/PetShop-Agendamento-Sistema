import React from 'react'

export default function StepPet({ data, onChange }) {
  return (
    <div className="space-y-4">
      <input
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        placeholder="Nome do pet"
        className="w-full border p-2 rounded"
      />

      <input
        value={data.ownerName || ""}
        onChange={(e) => onChange({ ...data, ownerName: e.target.value })}
        placeholder="Nome do dono"
        className="w-full border p-2 rounded"
        required
      />

      <input
        value={data.ownerPhone || ""}
        onChange={(e) => onChange({ ...data, ownerPhone: e.target.value })}
        placeholder="Telefone do dono"
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={data.species}
        onChange={(e) => onChange({ ...data, species: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option>Cachorro</option>
        <option>Gato</option>
      </select>

      <input
        value={data.breed}
        onChange={(e) => onChange({ ...data, breed: e.target.value })}
        placeholder="Raça (opcional)"
        className="w-full border p-2 rounded"
      />

      <select
        value={data.size}
        onChange={(e) => onChange({ ...data, size: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option>Pequeno</option>
        <option>Médio</option>
        <option>Grande</option>
      </select>

      <textarea
        rows="3"
        value={data.notes}
        onChange={(e) => onChange({ ...data, notes: e.target.value })}
        placeholder="Observações"
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
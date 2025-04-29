import React from 'react'

const bases = [
  'Banho Simples',
  'Banho + Tosa higiênica',
  'Banho + Tosa completa',
]
const extras = ['Cortar unha', 'Limpar ouvidos', 'Hidratação']

export default function StepService({ data, onChange }) {
  const toggleExtra = (e) =>
    onChange({
      ...data,
      extras: data.extras.includes(e)
        ? data.extras.filter(x => x !== e)
        : [...data.extras, e],
    })

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Serviço Base</h3>
      {bases.map(b => (
        <label key={b} className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.base === b}
            onChange={() => onChange({ ...data, base: b })}
          />
          {b}
        </label>
      ))}

      <h3 className="font-medium pt-4">Extras</h3>
      {extras.map(e => (
        <label key={e} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.extras.includes(e)}
            onChange={() => toggleExtra(e)}
          />
          {e}
        </label>
      ))}
    </div>
  )
}

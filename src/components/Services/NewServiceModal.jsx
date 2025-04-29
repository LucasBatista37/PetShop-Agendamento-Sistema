import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'

const defaultData = { name: '', price: 0, duration: 60, description: '' }

export default function NewServiceModal({ isOpen, onClose, initialData, onSave }) {
  const [form, setForm] = useState(defaultData)

  useEffect(() => {
    setForm(initialData || defaultData)
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />

      <Dialog.Panel className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <Dialog.Title className="text-lg font-semibold text-gray-800">
          {initialData ? 'Editar Serviço' : 'Novo Serviço'}
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Preço (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border rounded-md px-3 py-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Duração (min)</label>
              <input
                type="number"
                min="0"
                className="w-full border rounded-md px-3 py-2"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value, 10) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 h-24 resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  )
}

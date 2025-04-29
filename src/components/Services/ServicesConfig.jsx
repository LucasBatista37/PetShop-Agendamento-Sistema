import React, { useState } from 'react'
import {
  FaPlus,
  FaEdit,
  FaTrash,
} from 'react-icons/fa'
import NewServiceModal from './NewServiceModal'

const mockServices = [
  {
    id: 1,
    name: 'Banho Simples',
    price: 70,
    duration: 40,               
    description: 'Lavagem completa com shampoo neutro e secagem.'
  },
  {
    id: 2,
    name: 'Banho + Tosa higiênica',
    price: 90,
    duration: 60,
    description: 'Banho e tosa na região íntima, patas e focinho.'
  },
  {
    id: 3,
    name: 'Banho + Tosa completa',
    price: 120,
    duration: 90,
    description: 'Banho, secagem e tosa do corpo inteiro conforme padrão da raça.'
  },
]

export default function ServicesConfig() {
  const [services, setServices] = useState(mockServices)
  const [modalData, setModalData] = useState(null)  

  const handleSave = (service) => {
    if (modalData) {
      setServices(prev => prev.map(s => (s.id === service.id ? service : s)))
    } else {
      const id = Math.max(...services.map(s => s.id)) + 1
      setServices(prev => [...prev, { ...service, id }])
    }
    setModalData(null)
  }

  const handleDelete = (id) =>
    window.confirm('Excluir este serviço?') &&
    setServices(prev => prev.filter(s => s.id !== id))

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">Serviços</h1>

        <button
          onClick={() => setModalData(null)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <FaPlus /> Novo Serviço
        </button>
      </header>

      {services.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum serviço cadastrado.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={() => setModalData(s)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}

      <NewServiceModal
        isOpen={modalData !== null}
        initialData={modalData}
        onClose={() => setModalData(null)}
        onSave={handleSave}
      />
    </div>
  )
}

function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
        <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{service.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-indigo-600">
          R$ {service.price.toFixed(2)}
        </span>
        <div className="flex gap-3 text-sm">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  )
}

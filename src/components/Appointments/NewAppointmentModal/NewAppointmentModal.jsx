import React, { useState, useMemo, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaCheck, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import StepPet from "./Steps/StepPet";
import StepService from "./Steps/StepService";
import StepSchedule from "./Steps/StepSchedule";
import StepReview from "./Steps/StepReview";
import Joi from "joi";

const STEPS = ["Pet", "Serviço", "Data", "Revisão"];

const defaultData = {
  pet: {
    name: "",
    ownerName: "",
    ownerPhone: "",
    species: "Cachorro",
    breed: "",
    size: "Pequeno",
    notes: "",
  },
  service: { base: "", extras: [] },
  schedule: { date: "", time: "" },
};

export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  appointments,
  initialData,
}) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(defaultData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        pet: {
          name: initialData.petName || "",
          ownerName: initialData.ownerName || "",
          ownerPhone: initialData.ownerPhone || "",
          species: initialData.species || "Cachorro",
          breed: initialData.breed || "",
          size: initialData.size || "Pequeno",
          notes: initialData.notes || "",
        },
        service: {
          base: initialData.baseService,
          extras: initialData.extraServices || [],
        },
        schedule: {
          date: initialData.date?.slice(0, 10) || "",
          time: initialData.time || "",
        },
      });
    } else {
      setFormData(defaultData);
      setStep(0);
    }
    setErrors({});
  }, [initialData]);

  const freeTimes = useMemo(() => {
    if (!formData.schedule.date) return [];
    const MAX_PER_HOUR = 3;
    const dayAppts = appointments.filter(
      (a) => a.date.slice(0, 10) === formData.schedule.date
    );

    const hours = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      }
    }

    return hours.filter(
      (h) => dayAppts.filter((a) => a.time === h).length < MAX_PER_HOUR
    );
  }, [formData.schedule.date, appointments]);

  const schemas = [
    Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "O nome do pet é obrigatório.",
      }),
      ownerName: Joi.string().required().messages({
        "string.empty": "O nome do tutor é obrigatório.",
      }),
      ownerPhone: Joi.string()
        .allow("")
        .pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)
        .messages({
          "string.pattern.base": "Formato de telefone inválido.",
        }),
      species: Joi.string().valid("Cachorro", "Gato").required(),
      breed: Joi.string().allow(""),
      size: Joi.string().valid("Pequeno", "Medio", "Grande").required(),
      notes: Joi.string().allow(""),
    }),
    Joi.object({
      base: Joi.object().required().messages({
        "any.required": "Selecione um serviço base.",
        "object.base": "Selecione um serviço base válido.",
      }),
      extras: Joi.array(),
    }),
    Joi.object({
      date: Joi.date().required().messages({
        "any.required": "A data é obrigatória.",
        "date.base": "A data deve ser válida.",
      }),
      time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          "string.empty": "O horário é obrigatório.",
          "string.pattern.base": "Horário inválido (HH:mm).",
        }),
    }),
  ];

  const validateStep = () => {
    const schema = schemas[step];
    if (!schema) return true;
    const { error } = schema.validate(formData[Object.keys(formData)[step]], {
      abortEarly: false,
    });

    if (error) {
      const formatted = {};
      error.details.forEach((err) => {
        formatted[err.path[0]] = err.message;
      });
      setErrors(formatted);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const next = () => {
    const isValid = validateStep();
    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  function formDataToAppointment({ pet, service, schedule }) {
    return {
      petName: pet.name.trim(),
      ownerName: pet.ownerName.trim(),
      ownerPhone: pet.ownerPhone.trim(),
      species: pet.species,
      breed: pet.breed.trim(),
      size: pet.size,
      notes: pet.notes.trim(),
      baseService: service.base?._id || service.base || "", 
      extraServices: (service.extras || []).map((s) => s._id || s),
      date: schedule.date || "",
      time: schedule.time || "",
      status: initialData?._id ? initialData.status : "Pendente",
    };
  }

  const save = () => {
    onSave(formDataToAppointment(formData), initialData?._id);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="relative w-full sm:max-w-lg h-full sm:h-auto bg-white flex flex-col rounded-none sm:rounded-lg shadow-lg">
        <header className="sticky top-0 px-4 sm:px-6 py-4 bg-white/95 z-10 flex items-center justify-between rounded-none sm:rounded-t-lg">
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-800">
            {initialData?._id ? "Editar Agendamento" : "Novo Agendamento"}
          </Dialog.Title>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
          {step === 0 && (
            <StepPet
              data={formData.pet}
              onChange={(d) => setFormData((f) => ({ ...f, pet: d }))}
              errors={errors}
            />
          )}
          {step === 1 && (
            <StepService
              data={formData.service}
              onChange={(d) => setFormData((f) => ({ ...f, service: d }))}
              errors={errors}
            />
          )}
          {step === 2 && (
            <StepSchedule
              data={formData.schedule}
              freeTimes={freeTimes}
              onChange={(d) => setFormData((f) => ({ ...f, schedule: d }))}
              errors={errors}
            />
          )}
          {step === 3 && <StepReview data={formData} />}
        </div>

        <footer className="sticky bottom-0 px-4 sm:px-6 py-4 bg-white/95 flex justify-between rounded-none sm:rounded-b-lg">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <FaChevronLeft /> Voltar
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Próximo <FaChevronRight />
            </button>
          ) : (
            <button
              onClick={save}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FaCheck /> Salvar
            </button>
          )}
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}

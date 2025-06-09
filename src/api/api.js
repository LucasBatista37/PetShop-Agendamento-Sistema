import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchDashboardStats = () => api.get("/dashboard/stats");
export const fetchAppointments = () => api.get("/appointments");
export const createAppointment = (data) =>
  api.post("/appointments", {
    petName: data.petName,
    species: data.species,
    breed: data.breed,
    notes: data.notes,
    size: data.size,
    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
    baseService:
      typeof data.baseService === "object"
        ? data.baseService._id
        : data.baseService,
    extraServices: data.extraServices.map((s) =>
      typeof s === "object" ? s._id : s
    ),
    date: data.date,
    time: data.time,
    status: "Pendente",
  });

export const updateAppointment = (id, data) =>
  api.put(`/appointments/${id}`, {
    ...data,
    baseService:
      typeof data.baseService === "object"
        ? data.baseService._id
        : data.baseService,
    extraServices: data.extraServices.map((s) =>
      typeof s === "object" ? s._id : s
    ),
  });

export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export const fetchServices = () => api.get("/services");

export const createService = (data) =>
  api.post("/services", {
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    duration: parseInt(data.duration, 10),
    extra: data.extra,
  });

export const updateService = (id, data) => api.put(`/services/${id}`, data);

export const deleteService = (id) => api.delete(`/services/${id}`);

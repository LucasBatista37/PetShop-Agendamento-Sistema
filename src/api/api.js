import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;
        setAuthToken(newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        setAuthToken(null);
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
  } finally {
    setAuthToken(null);
    window.location.href = "/login";
  }
};

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

export const sendSupportMessage = (data) => api.post("/support", data);

export const sendForgotPasswordLink = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = ({ email, token, newPassword }) =>
  api.post("/auth/reset-password", { email, token, newPassword });

export const inviteCollaborator = ({ email, department }) =>
  api.post("/collaborators/invite", { email, department });

export const acceptInvite = (data) =>
  api.post("/collaborators/accept-invite", data);

export const fetchCollaborators = () => api.get("/collaborators");

export const deleteCollaborator = (id) => api.delete(`/collaborators/${id}`);

export const createCheckoutSession = async (priceId, customerEmail) => {
  try {
    const res = await api.post("/stripe/create-checkout-session", {
      priceId,
      customerEmail,
    });
    return res.data.url; // retorna URL de checkout
  } catch (err) {
    console.error("Erro ao criar sessão de checkout:", err);
    throw err;
  }
};

export default api;

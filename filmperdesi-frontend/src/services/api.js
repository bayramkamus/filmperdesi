import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor'u
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor'u
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (identifier, password) => {
  try {
    const response = await api.post("/auth/login", {
      identifier,
      password,
    });

    // Backend'den gelen jwt token'ı ve user bilgilerini kaydet
    const { jwt, user } = response.data;
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return { jwt, user };
  } catch (error) {
    console.error("Login error:", error.response?.data);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    if (response.data.jwt) {
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const response = await api.get("/matches");
    return response.data;
  } catch (error) {
    console.error("getMatches error:", error);
    throw error;
  }
};

export const createMatch = async (matchData) => {
  try {
    const response = await api.post("/matches", { ...matchData });
    return response.data;
  } catch (error) {
    console.error("createMatch error:", error);
    throw error;
  }
};

export const createMessage = async (messageData) => {
  try {
    const response = await api.post("/messages", { ...messageData });
    return response.data;
  } catch (error) {
    console.error("createMessage error:", error);
    throw error;
  }
};

export const getMessages = async () => {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("getMessages error:", error);
    throw error;
  }
};

export const updateMessage = async (id, messageData) => {
  try {
    const response = await api.put(`/messages/${id}`, { ...messageData });
    return response.data;
  } catch (error) {
    console.error("updateMessage error:", error);
    throw error;
  }
};

// Admin API fonksiyonları
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAllMessages = async () => {
  const response = await api.get("/admin/messages");
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/admin/messages/${messageId}`);
  return response.data;
};

export default api;

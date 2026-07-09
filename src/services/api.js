import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-production-f558a.up.railway.app",
});

export default api;
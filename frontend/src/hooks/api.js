import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000/api", // uncomment by local dev
  baseURL: process.env.REACT_APP_API_URL + "api", // comment by local dev
  withCredentials: true,
});

export default api;

import axios from "axios";

export const api = axios.create({
  baseURL: "https://time-clock-backend.vercel.app/api",
});

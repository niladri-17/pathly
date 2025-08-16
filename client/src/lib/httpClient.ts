import axios, { type AxiosInstance } from "axios";

const httpClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add interceptors

export default httpClient;

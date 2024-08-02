import axios from "axios";

const apiUrl = "http://localhost:4000";

export const backend = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  },
});

backend.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log('Error en el request');
    return Promise.reject(error);
  }
);

backend.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    console.log('Error en el response');
    return Promise.reject(error);
  }
);
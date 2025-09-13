import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE || "http://localhost:8080",
  withCredentials: false,
});

let accessToken = null;
let refreshToken = null;

export function setTokens(at, rt) {
  accessToken = at;
  refreshToken = rt;
  api.defaults.headers.common["Authorization"] = `Bearer ${at}`;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  delete api.defaults.headers.common["Authorization"];
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let queue = [];

function onRefreshed(newToken) {
  queue.forEach((cb) => cb(newToken));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response) throw error;
    if (response.status === 401 && refreshToken && !config._retry) {
      config._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const r = await axios.post(
            `${import.meta.env?.VITE_API_BASE || "http://localhost:8080"}/api/auth/refresh`,
            { refreshToken }
          );
          const { accessToken: newAT, refreshToken: newRT } = r.data;
          setTokens(newAT, newRT);
          isRefreshing = false;
          onRefreshed(newAT);
          return api(config);
        } catch (e) {
          isRefreshing = false;
          clearTokens();
          throw e;
        }
      }
      return new Promise((resolve) => {
        queue.push((t) => {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${t}`;
          resolve(api(config));
        });
      });
    }
    throw error;
  }
);

export default api;

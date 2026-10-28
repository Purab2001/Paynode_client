import axios from "axios";
import { auth } from "@/lib/firebase";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 15_000 });

/** Error thrown for every failed API call. `code` matches the backend's error codes. */
export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Attach the current Firebase ID token (refreshed automatically by the SDK when it expires).
api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors to ApiError with a message that is safe to show to the user.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const body = err.response?.data?.error;
    if (body) {
      return Promise.reject(new ApiError(body.message, { status: err.response.status, code: body.code, details: body.details }));
    }
    const offline = !err.response;
    return Promise.reject(
      new ApiError(offline ? "We couldn't reach PayNode. Check your connection and try again." : "Something went wrong. Please try again.", {
        status: err.response?.status,
        code: offline ? "NETWORK" : "UNKNOWN",
      }),
    );
  },
);

/** GET/POST/PATCH helpers that return the response body directly. */
export const http = {
  get: (url, params) => api.get(url, { params }).then((r) => r.data),
  post: (url, body) => api.post(url, body).then((r) => r.data),
  patch: (url, body) => api.patch(url, body).then((r) => r.data),
  delete: (url) => api.delete(url).then((r) => r.data),
};

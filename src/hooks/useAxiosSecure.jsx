import axios from "axios";
import React from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `https://paynode-server.vercel.app`,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    async (config) => {
      if (user) {
        try {
          // Get the current user's ID token
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      const status = error.response?.status;
      if (status === 403) {
        navigate("/forbidden");
      } else if (status === 401) {
        logOut()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;

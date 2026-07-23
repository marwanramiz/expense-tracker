// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://expense-tracker-7xlg.onrender.com",
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

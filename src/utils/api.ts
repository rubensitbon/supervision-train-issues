import axios from 'axios';

export const BASE_URL = 'http://192.168.43.137:3000';

const api = axios.create({
  baseURL: BASE_URL
});

export default api;

import axios from 'axios';

export const BASE_URL =
  process.env.REACT_APP_SERVER_IP && process.env.REACT_APP_SERVER_PORT
    ? `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`
    : 'http://localhost:3000';

const api = axios.create();

export default api;

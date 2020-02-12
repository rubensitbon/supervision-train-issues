import axios from 'axios';

console.log('process.env.REACT_APP_SERVER_IP', process.env.REACT_APP_SERVER_IP);
console.log(
  'process.env.REACT_APP_SERVER_PORT',
  process.env.REACT_APP_SERVER_PORT
);

export const BASE_URL =
  process.env.REACT_APP_SERVER_IP && process.env.REACT_APP_SERVER_PORT
    ? `http;//${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`
    : 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL
});

export default api;

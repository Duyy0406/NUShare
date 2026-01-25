import axios from 'axios';

const baseURL = import.meta.env.PROD 
  ? 'https://nushare.onrender.com/api'
  : 'http://localhost:8080/api';

const client = axios.create({
  baseURL: baseURL,
});

// Attaches the JWT token to requests
export const setAuthToken = (token: string) => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
};

export default client;
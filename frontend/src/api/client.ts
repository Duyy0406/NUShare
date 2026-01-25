import axios from 'axios';

// Creates a standard instance for all backend requests
const client = axios.create({
  baseURL: 'http://localhost:8080/api'
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
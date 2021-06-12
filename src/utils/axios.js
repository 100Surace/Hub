import axios from 'axios';

// ----------------------------------------------------------------------
const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

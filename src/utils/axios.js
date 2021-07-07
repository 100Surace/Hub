import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';

// ----------------------------------------------------------------------
const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`
});

function getAccessToken() {
  const accessToken = reactLocalStorage.get('accessToken');
  return accessToken;
}

axiosInstance.interceptors.request.use((req) => {
  req.headers.Authorization = 'Bearer ' + getAccessToken();
  return req;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

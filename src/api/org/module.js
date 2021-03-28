import axios from 'axios';
import baseURL from 'src/api/baseUrl';

const ENDPOINT = '/api/modules/';
const URL = baseURL + ENDPOINT;
const module = {
  GET: () => axios.get(URL),
  GETBYID: (id) => axios.get(URL + id),
  POST: (newRecord) => axios.post(URL, newRecord),
  PUT: (id, updateRecord) => axios.put(URL + id, updateRecord),
  DELETE: (id) => axios.delete(URL + id)
};
export default module;

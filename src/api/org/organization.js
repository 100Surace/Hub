import axios from 'axios';
import baseURL from 'src/api/baseUrl';

const ENDPOINT = '/api/Orgs/';
const URL = baseURL + ENDPOINT;
const organization = {
  GET_USER_ORG: (user_id) => axios.get(URL + 'users/' + user_id),
  GETBYID: (id) => axios.get(URL + id),
  POST: (newRecord) => axios.post(URL, newRecord),
  PUT: (id, updateRecord) => axios.put(URL + id, updateRecord),
  DELETE: (id) => axios.delete(URL + id)
};

export default organization;

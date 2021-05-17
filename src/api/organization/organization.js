import axios from '../../utils/axios';

const BASE_ENDPOINT = '/Orgs';
const API = {
  GET_USER_ORG: (userID) => axios.get(`${BASE_ENDPOINT}/users/${userID}`),
  GETBYID: (id) => axios.get(`${BASE_ENDPOINT}/${id}`),
  POST: (formData) => axios.post(BASE_ENDPOINT, formData),
  PUT: (id, formData) => axios.put(`${BASE_ENDPOINT}/${id}`, formData),
  DELETE: (id) => axios.delete(`${BASE_ENDPOINT}/${id}`)
};

export default API;

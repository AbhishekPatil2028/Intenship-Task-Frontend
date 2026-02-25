import axios from "axios";

const BASE_URL = "http://localhost:5000/api/form";

export const getContacts = () => axios.get(BASE_URL);
export const createContact = (data) => axios.post(BASE_URL, data);
export const updateContact = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);
export const deleteContact = (id) =>
  axios.delete(`http://localhost:5000/api/form/${id}`);


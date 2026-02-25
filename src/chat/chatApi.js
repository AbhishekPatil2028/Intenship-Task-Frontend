import axios from "axios";

const chatApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default chatApi;

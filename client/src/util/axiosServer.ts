import axios from "axios";
export default axios.create({
  baseURL: SERVER_URL,
});

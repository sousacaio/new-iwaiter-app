import axios from 'axios';
import {API_URL} from '../../env';
//const base = 'http://192.168.15.5:3000/v1/';
const base = `${API_URL}v1/`;

const api = axios.create({
  baseURL: base,
});
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default api;

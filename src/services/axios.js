import axios from 'axios';

const base = 'http://192.168.15.5:3000/v1/';

const api = axios.create({
    baseURL: base
});
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default api;
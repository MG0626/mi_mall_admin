// 导入axios
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 5000
});

// 请求拦截器
http.interceptors.request.use(config => {
  return config;
});
// 响应拦截器
http.interceptors.response.use(res => {
  return res.data;
});

export default http;
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const { statusCode: status } = error.response.data;

    if (status === 403) {
      window.location = '/login';
    }

    return Promise.reject(new Error(error));
  }
);
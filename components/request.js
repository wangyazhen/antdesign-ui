
import axios from 'axios';
import _ from 'lodash';

const fetch = (url, options) => {
  const {
    method = 'get',
    body,
  } = options;

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: body,
      });
    case 'delete':
      return axios.delete(url, {
        data: body,
      });
    case 'post':
      return axios.post(url, body);
    case 'put':
      return axios.put(url, body);
    case 'patch':
      return axios.patch(url, body);
    default:
      return axios(options);
  }
};


const defaultOpt = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export default async function request(url, options = {}) {
  return fetch(url, { ...defaultOpt, ...options })
    .then((response) => {
      return {
        success: true,
        jsonData: _.get(response, 'data'),
      };
    })
    .catch((error) => {
      return {
        success: false,
        jsonData: _.get(error,'response.data'),
      };
    });
}

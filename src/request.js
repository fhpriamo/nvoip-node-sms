const axios = require('axios');

const createRequest = ({ timeout = 3000 }) => {
  return ({ data, url, method, headers }) => {
    return axios.request({
      url,
      data,
      method,
      headers,
      timeout,
      transformResponse: [data => data],
    });
  };
}

module.exports = createRequest;

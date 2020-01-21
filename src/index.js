const errors = require('./errors');
const createRequest = require('./request');
const { SmsClient } = require('./client');

const API_URL = 'https://api.nvoip.com.br/v1/sms';

const createClient = (config) => {
  config = {
    authToken: '',
    url: API_URL,
    request: createRequest({ timeout: 3000 }),
    ...config,
  };

  return new SmsClient(config);
};

module.exports = {
  ...errors,
  createRequest,
  createClient,
};

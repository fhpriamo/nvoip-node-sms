const {
  MessageValidationError,
  PhoneNumberValidationError,
  HttpRequestError,
} = require('./errors');

const phoneNumberRegex = new RegExp(`^[0-9]+\$`);

class Message {

  get size() {
    return this._msg.length;
  }

  constructor(messageStr) {
    this._validate(messageStr);
    this._msg = messageStr;
  }

  _validate(messageStr) {
    if (messageStr.length > 140) {
      throw new MessageValidationError(
        'Message overseeds the maximum of 140 characters',
        'MESSAGE_TOO_LONG_ERR',
        { invalidMessage: messageStr }
      );
    }
  }

  valueOf() {
    return this._msg;
  }

  toString() {
    return this.valueOf();
  }

  toJSON() {
    return this.toString();
  }
}

class PhoneNumber {

  get size() {
    return this._phoneNumber.length;
  }

  constructor(phoneNumberStr) {
    this._validate(phoneNumberStr);
    this._phoneNumber = phoneNumberStr;
  }

  _validate(phoneNumberStr) {
    if (!phoneNumberRegex.test(phoneNumberStr)) {
      throw new PhoneNumberValidationError(
        `Phone number ${phoneNumberStr} is invalid`,
        { invalidPhoneNumber: phoneNumberStr }
      );
    }
  }

  valueOf() {
    return this._phoneNumber;
  }

  toString() {
    return this.valueOf();
  }

  toJSON() {
    return this.toString();
  }
}

class SmsClient {

  constructor({ authToken, request, url }) {
    this._request = request;
    this._url = url;
    this._method = 'post';
    this._headers = {
      'Content-Type': 'application/json',
      'token_auth': authToken,
    };
  }

  async sendSms(phoneNumber, message) {
    const data = JSON.stringify({
      celular: new PhoneNumber(phoneNumber),
      msg: new Message(message),
    });

    let response;

    try {
      response = await this._request({
        data,
        url: this._url,
        method: this._method,
        headers: this._headers,
      });
    } catch (err) {
      throw new HttpRequestError(err);
    }

    return response;
  }
}

module.exports = {
  SmsClient,
  PhoneNumber,
  Message,
};

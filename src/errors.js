class SmsClientError extends Error {

  constructor(e) {
    super(e);

    this.message = e.message || e;
    this.extensions = {};

    Object.defineProperty(this, 'name', { value: this.constructor.name });

    Error.captureStackTrace(this, this.constructor);
  }
}

class HttpRequestError extends SmsClientError {
  constructor(e) {
    super(e);

    this.extensions = {
      originalError: e,
    };
  }
}

class ValidationError extends SmsClientError {
  // No implementation
}

class PhoneNumberValidationError extends ValidationError {

  constructor(e, { invalidPhoneNumber }) {
    super(e);

    this.extensions = {
      invalidPhoneNumber,
    };
  }
}

class MessageValidationError extends ValidationError {

  constructor(e, code, { invalidMessage }) {
    super(e);

    this.code = code;
    this.extensions = {
      invalidMessage,
    };
  }
}

module.exports = {
  SmsClientError,
  ValidationError,
  PhoneNumberValidationError,
  MessageValidationError,
  HttpRequestError,
};

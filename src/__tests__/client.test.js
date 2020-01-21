const { PhoneNumber, Message, SmsClient } = require('../client');
const {
  PhoneNumberValidationError,
  MessageValidationError,
  HttpRequestError,
} = require('../errors');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('client', () => {

  describe('PhoneNumber', () => {

    it.each`
      invalidPhone
      ${''},
      ${'ab888592835'},
      ${'32 92222 2835'},
      ${'32 92222-2835'},
      ${'(32) 922222835'},
      ${'(32)922222835'},
      ${'(32)9222-22835'},
      ${' 32922222835'},
      ${'32922222835 '},
    `('rejects invalid phone numbers.', ({ invalidPhone }) => {
      expect(() => new PhoneNumber(invalidPhone)).toThrow(PhoneNumberValidationError)
    });

    it.each`
      validPhone
      ${32984092323},
      ${'32984092323'},
      ${'11984092323'},
      ${'555'},
    `('accepts valid phone numbers.', ({ validPhone }) => {
      expect(() => new PhoneNumber(validPhone)).not.toThrow();
    });

    it('is JSON serializable.', () => {
      const number = '32988128811';
      const pn = new PhoneNumber(number);

      const json = JSON.stringify({ phoneNumber: pn });

      expect(JSON.parse(json)).toEqual(expect.objectContaining({
        phoneNumber: number,
      }));
    });

    it('reports its size.', () => {
      const pn = new PhoneNumber('1234567891234567890');

      expect(pn.size).toBe(19);
    });
  });

  describe('Message', () => {

    it.each`
      invalidMessage
      ${'['},
      ${']'},
      ${'á'},
      ${'♡'},
      ${'~'},
      ${'ç'},
      `('rejects message texts with forbidden characters.', ({ invalidMessage }) => {
      expect.assertions(2);

      try {
        new Message(invalidMessage);
      } catch (err) {
        expect(err).toBeInstanceOf(MessageValidationError);
        expect(err.code).toBe('MESSAGE_CONTAINS_INVALID_CHARACTERS_ERR');
      }
    });

    it.each`
      validMessage
      ${'01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'},
      ${'Oi, Joao!\n\rQuer ficar milhonario???'},
      ${'Que a forca esteja com voce!'},
      ${'Codigo de verificacao: 523532\n(Valido ate 25-11-2019)'},
    `('accepts valid messages.', ({ validMessage }) => {
      expect(() => new Message(validMessage)).not.toThrow();
    });

    it('is JSON serializable.', () => {
      const text = 'Parabens! Voce foi sorteado...'
      const msg = new Message(text);

      const json = JSON.stringify({ message: msg });

      expect(JSON.parse(json)).toEqual(expect.objectContaining({
        message: text,
      }));
    });

    it('rejects a message that exceeds 140 characters.', () => {
      const tooLongText = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789X'

      expect.assertions(2);

      try {
        new Message(tooLongText);
      } catch (err) {
        expect(err).toBeInstanceOf(MessageValidationError);
        expect(err.code).toBe('MESSAGE_TOO_LONG_ERR');
      }
    });

    it('informs its size', () => {
      const msg = new Message('Codigo de verificacao: 523532\n(Valido ate 25-11-2019)');

      expect(msg.size).toBe(53);
    });
  });

  describe('SmsClient', () => {

    it('sends a SMS', async () => {
      const requestMock = jest.fn();

      const client = new SmsClient({
        request: requestMock,
      });

      const data = ({
        celular: '32988125723',
        msg: 'Aviso: seus creditos expiram em 12-05-20',
      });

      await client.sendSms(data.celular, data.msg);

      expect(requestMock).toHaveBeenCalledTimes(1);
    });

    it('throws an error if http request fails.', () => {
      const requestMock = jest.fn(() => {
        return Promise.reject(new Error('Http request error'));
      });

      const client = new SmsClient({
        request: requestMock,
      });

      const data = ({
        celular: '32988125723',
        msg: 'Aviso: seus creditos expiram em 12-05-20',
      });

      return expect(client.sendSms(data.celular, data.msg))
        .rejects
        .toThrow(HttpRequestError);
    });
  });
});

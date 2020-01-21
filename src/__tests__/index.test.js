const { createClient } = require('../index');

describe('createClient', () => {

  it('creates a SmsClient', async () => {
    const requestMock = jest.fn();
    const config = {
      url: 'https://github.com/fhpriamo',
      authToken: 'authtoken',
      request: requestMock,
    };

    const client = createClient(config);

    await client.sendSms('11111111111', ' ');

    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      url: config.url,
      headers: expect.objectContaining({
        'token_auth': config.authToken,
      }),
    }));
  });
});

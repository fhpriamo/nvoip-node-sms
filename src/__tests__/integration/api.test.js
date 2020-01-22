const { createClient } = require('../../index');
const { TEXT_160_CHARS } = require('../fixtures');

const TEST_PHONE_NUMBER = process.env.TEST_PHONE_NUMBER;
if (!TEST_PHONE_NUMBER) throw new Error('TEST_PHONE_NUMBER env variable not set');

const NVOIP_API_TOKEN = process.env.NVOIP_API_TOKEN;
if (!NVOIP_API_TOKEN) throw new Error('NVOIP_API_TOKEN env variable not set');

describe('integration', () => {

  describe('api', () => {

    it('sends a SMS succesfully.', async () => {
      const client = createClient({
        authToken: NVOIP_API_TOKEN,
      });

      await client.sendSms(TEST_PHONE_NUMBER, TEXT_160_CHARS);
    });
  });
});

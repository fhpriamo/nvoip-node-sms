# nvoip-node-sms

Send SMS messages in node via Nvoip SMS API.

## Installation

Install nvoip-node-sms from npm

with yarn:

~~~
yarn add nvoip-node-sms
~~~

or alternatively using npm:

~~~
npm install --save nvoip-node-sms
~~~

## Testing

With yarn:

~~~
yarn test
~~~

or alternatively using npm:

~~~
npm run test
~~~

## Basic usage

To be able to send messages, you'll need an access token provided by Nvoip. You can get it by signing in on https://www.nvoip.com.br. After signing in, go to 'Configurações' > 'Integrações' and click the button 'Abrir' on the 'ExactSales' div to launch a pop up window. You should be able to copy the token string (the string that follows the word 'Token') from there.

~~~javascript

// Import the client factory function:

const { createClient } = require('nvoip-node-sms');

// or alternatively using ES6 imports:
// import { createClient } from 'nvoip-node-sms';

// Instantiate a client:

const client = createClient({ authToken: '523abc21d8b659bc19553d5ce5b42' });

// Send a message!

client.sendSms('1111111111', 'Hi!')
  .then(response => console.log(response))
  .catch(error => console.error(error));

// That's it!
~~~

## Command line utility

nvoip-node-sms bundles with a simple command line utililty that enables you to send messages without the need to write any code.

You can check the available options using

~~~
./bin/send-sms --help
~~~

Be sure the script has the necessary permissions to execute. You can, of course, use `chmod +x ./bin/send-sms` for that.

Its also possible to run it without installation using npx.

## API

### `createClient(config)`

Creates a client for sending messages.

#### Parameters:

- config Object» a configuration object:
  - authToken «String» the authentication token.
  - \[url] «String» the API endpoint.
  - \[request] «Function» custom request function. (see the request module for more details).

#### Returns

A SMS client «SmsClient».

#### Example

~~~javascript

const client = createClient({
  url: 'https://api.nvoip.com.br/v1/sms',
  authToken: '523abc21d8b659bc19553d5ce5b42',
});

~~~

### `SmsClient.prototype.sendSms(phoneNumber, textMessage)`

- phoneNumber «String» a phone number containing nothing but digits.
- textMessage «String» the message to be sent.

#### Returns

A promise «Promise» containing the API response data.

#### Throws

- «MessageValidationError» if the textMessage is invalid.
- «PhoneNumberValidationError» if the phoneNumber is invalid.
- «HttpRequestError» if the HTTP request failed.

#### Example

~~~javascript

const client = createClient({
  authToken: '523abc21d8b659bc19553d5ce5b42',
});

client.sendSms('121212121', 'How are you doing?')
  .then(data => console.log(data));

~~~

### Error Handling

A collection of errors are provided in order to enable proper error handling and control flow. You can safely use the `instanceof` operator in a catch block to detemine the precise source and cause of the error.

Error hierarchy:

- «SmsClientError»
  - «HttpRequestError»
  - «ValidationError»
    - «PhoneNumberValidationError»
    - «MessageValidationError»

Check the errors module for more details.

Example:

~~~javascript

//...
const {
  ValidationError,
  HttpRequestError,
  createClient,
} = require('nvoip-node-sms');

// Immediately invoked asynchronous function
(async () => {

  // ...

  const client = createClient({
    authToken: '523abc21d8b659bc19553d5ce5b42',
  });

  // ...

  let response;

  try {
    response = await client.sendSms('1125235235', 'Hi!');
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error('error: be more careful with your input!');
    } else if (err instanceof HttpRequestError) {
      console.error('error: maybe check your network connection?!');
    } else {
      // Unknown error, don't treat it:
      throw err;
    }
  }

  console.log(response);

  // ...
}())

// ...

~~~

// __mocks__/https.js
module.exports = {
    get: jest.fn(() => Promise.resolve({})), // Mock basic https behavior
  };
  
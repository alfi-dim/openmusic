/* eslint-disable no-console */
const InvariantError = require('../../exception/InvariantError');
const { songsPayloadScema } = require('./schema');

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = songsPayloadScema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;

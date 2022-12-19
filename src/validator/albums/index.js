/* eslint-disable no-console */
const InvariantError = require('../../exception/InvariantError');
const { albumsPayloadSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumsPayload: (payload) => {
    const validationResult = albumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;

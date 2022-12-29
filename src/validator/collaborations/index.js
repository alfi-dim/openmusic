const InvariantError = require('../../exception/InvariantError');
const collaborationsPayloadSchema = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationsPayload: (payload) => {
    const validationResult = collaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteCollaborationsPayload: (payload) => {
    const validationResult = collaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;

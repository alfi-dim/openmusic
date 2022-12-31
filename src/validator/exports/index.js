const InvariantError = require('../../exception/InvariantError');
const exportsPayloadSchema = require('./schema');

const ExportsValidator = {
  validatePostExportPayload: (payload) => {
    const validationResult = exportsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;

const Joi = require('joi');

const exportsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = exportsPayloadSchema;

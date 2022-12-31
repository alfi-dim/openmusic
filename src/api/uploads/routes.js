const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.postUploadCoverHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/covers/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file/images'),
      },
    },
  },
];

module.exports = routes;

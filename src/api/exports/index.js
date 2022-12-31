const ExportHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, { playlistsService, producerService, validator }) => {
    const exportHandler = new ExportHandler(playlistsService, producerService, validator);
    await server.route(routes(exportHandler));
  },
};

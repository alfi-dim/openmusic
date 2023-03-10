const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService, usersService, songsService, validator,
  }) => {
    const playlistHandler = new PlaylistsHandler(
      playlistsService,
      usersService,
      songsService,
      validator,
    );
    server.route(routes(playlistHandler));
  },
};

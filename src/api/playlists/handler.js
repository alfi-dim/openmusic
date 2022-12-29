/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
class PlaylistsHandler {
  constructor(playlistService, usersService, songsService, validator) {
    this._playlistsService = playlistService;
    this._usersService = usersService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getAllPlaylist(credentialId);
    await Promise.all(playlists.map(async (playlist) => {
      const { username: ownerId } = playlist;
      const ownerName = await this._usersService.getUsernameById(ownerId);
      // eslint-disable-next-line no-param-reassign
      playlist.username = ownerName;
    }));
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner({ playlistId: id, userId: credentialId });
    await this._playlistsService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._validator.validateSongToPlaylistPayload(request.payload);
    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId });
    await this._playlistsService.addSongToPlaylist({ playlistId: id, songId });
    await this._playlistsService.addPlaylistSongActivities({
      playlistId: id, songId, userId: credentialId, action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId });
    const playlist = await this._playlistsService.getPlaylistById(id);
    const songsId = await this._playlistsService.getSongIdbyPlaylist(id);

    // get playlist owner name from owner id
    const { username: ownerId } = playlist;
    const ownerName = await this._usersService.getUsernameById(ownerId);
    playlist.username = ownerName;

    // get song detail
    const songs = [];
    await Promise.all(songsId.map(async ({ song_id: songId }) => {
      const data = await this._songsService.getSongById(songId);
      const { id: dataId, title, performer } = data;
      const song = { id: dataId, title, performer };
      songs.push(song);
    }));

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId });
    await this._validator.validateSongToPlaylistPayload(request.payload);
    await this._playlistsService.deleteSongFromPlaylist(id, songId);
    await this._playlistsService.addPlaylistSongActivities({
      playlistId: id, songId, userId: credentialId, action: 'delete',
    });

    return {
      status: 'success',
      message: 'lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId });
    const activities = await this._playlistsService.getPlaylistActivitiesByPlaylistId({
      playlistId: id, userId: credentialId,
    });

    await Promise.all(activities.map(async (activity) => {
      // get username
      const { username: userId } = activity;
      const username = await this._usersService.getUsernameById(userId);
      activity.username = username;

      // get song title
      const { title: songId } = activity;
      const title = await this._songsService.getSongTitleById(songId);
      activity.title = title;
    }));

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;

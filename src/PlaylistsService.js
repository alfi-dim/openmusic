/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { mapDBToModelSongs, mapDBToModelPlaylists } = require('./mapDBToModel');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return mapDBToModelPlaylists(result.rows[0]);
  }

  async getSongIdbyPlaylist(playlistId) {
    const query = {
      text: 'SELECT song_id FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelSongs)[0];
  }
}

module.exports = PlaylistsService;

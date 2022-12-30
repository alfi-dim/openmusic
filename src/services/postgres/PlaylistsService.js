const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exception/AuthorizationError');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFound');
const { mapDBToModelPlaylists, mapDBToModelPlaylistsActivities } = require('../../utils/mapDBToModel');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const playlistId = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [playlistId, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllPlaylist(owner) {
    const query = {
      text: 'SELECT playlist.* FROM playlist \
      LEFT JOIN collaborations ON collaborations.playlist_id = playlist_id \
      WHERE playlist.owner = $1 OR collaborations.user_id = $1 \
      GROUP BY playlist.id',
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelPlaylists);
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return mapDBToModelPlaylists(result.rows[0]);
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus');
    }
  }

  async verifySongIsExist(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async verifyPlaylistOwner({ playlistId, userId: owner }) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess({ playlistId, userId }) {
    try {
      await this.verifyPlaylistOwner({ playlistId, userId });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const playlistSongid = `playlist-song-${nanoid(16)}`;
    await this.verifySongIsExist(songId);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [playlistSongid, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
  }

  async getSongIdbyPlaylist(playlistId) {
    const query = {
      text: 'SELECT song_id FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus, id tidak ditemukan');
    }
  }

  async addPlaylistSongActivities({
    playlistId, songId, userId, action,
  }) {
    const id = `playlist-activities-${nanoid(16)}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, date],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Activities gagal ditambahkan');
    }
  }

  async getPlaylistActivitiesByPlaylistId({ playlistId, userId }) {
    const query = {
      text: 'SELECT song_id, user_id, action, time FROM playlist_song_activities WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activities tidak ditemukan');
    }

    return result.rows.map(mapDBToModelPlaylistsActivities);
  }
}

module.exports = PlaylistsService;

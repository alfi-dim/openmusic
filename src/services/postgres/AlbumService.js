const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFound');
const { mapDBToModelAlbum } = require('../../utils/mapDBToModel');

class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return mapDBToModelAlbum(result.rows[0]);
  }

  async getSongByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      return 'Tidak ada lagu di album ini';
    }

    return result.rows;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal diperbarui. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addCoverAlbum(id, fileLocation) {
    const query = {
      text: 'UPDATE album SET cover = $1 WHERE id = $2 RETURNING id',
      values: [fileLocation, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Cover album gagal diperbarui. Id tidak ditemukan');
    }
  }

  async likeAlbum(userId, albumId) {
    const id = `album-like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menyukai album');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async dislikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal batal menyukai album');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async verifyIsUserAlreadyLikedAlbum(userId, albumId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Pengguna sudah menyukai album');
    }
  }

  async giveAlbumALike(userId, albumId) {
    try {
      await this.verifyIsUserAlreadyLikedAlbum(userId, albumId);
      await this.likeAlbum(userId, albumId);
      return 'Berhasil menyukai album';
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      await this.dislikeAlbum(userId, albumId);
      return 'Berhasil membatalkan menyukai album';
    }
  }

  async getAlbumLikeCounter(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      const response = {
        likesCounts: JSON.parse(result),
        source: 'cache',
      };

      return response;
    } catch (error) {
      const query = {
        text: 'SELECT * FROM album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = result.rowCount;
      await this._cacheService.set(`likes:${albumId}`, likes);
      const response = {
        likesCounts: JSON.parse(result.rowCount),
        source: 'database',
      };
      return response;
    }
  }
}

module.exports = AlbumService;

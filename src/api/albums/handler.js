class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan.',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const albumData = await this._service.getAlbumById(id);
    const songs = await this._service.getSongByAlbumId(id);
    const result = {
      status: 'success',
      data: {
        album: {
          ...albumData,
          songs,
        },
      },
    };
    return result;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const message = await this._service.giveAlbumALike(credentialId, id);
    const response = h.response({
      status: 'success',
      message,
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { id } = request.params;

    const data = await this._service.getAlbumLikeCounter(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: data.likesCounts,
      },
    });
    response.header('X-Data-Source', data.source);
    return response;
  }
}

module.exports = AlbumHandler;

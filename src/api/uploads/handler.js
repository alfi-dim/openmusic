class UploadsHandler {
  constructor(storageService, albumService, validator) {
    this._storageService = storageService;
    this._albumService = albumService;
    this._validator = validator;
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateCoverHeaders(cover.hapi.headers);

    const { id } = request.params;
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`;
    await this._albumService.addCoverAlbum(id, fileLocation);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;

class ExportHandler {
  constructor(playlistsService, producerService, validator) {
    this._playlistsService = playlistsService;
    this._producerService = producerService;
    this._validator = validator;
  }

  async postExportPlaylistByIdHandler(request, h) {
    this._validator.validatePostExportPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    await this._playlistsService.verifyPlaylistAccess({ playlistId, userId });

    const message = {
      userId,
      playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan anda dalam antrian',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;

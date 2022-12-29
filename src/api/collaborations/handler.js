/* eslint-disable no-underscore-dangle */
class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    await this._validator.validatePostCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner({ playlistId, userId: credentialId });
    await this._usersService.verifyUserIsExistById({ userId });
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    await this._validator.validateDeleteCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner({ playlistId, userId: credentialId });
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;

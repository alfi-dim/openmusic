/* eslint-disable no-underscore-dangle */
class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    const { playlistId, targetEmail } = JSON.parse(message.content.toString());
    const playlists = await this._playlistsService.getPlaylistById(playlistId);
    const songsId = await this._playlistsService.getSongIdbyPlaylist(playlistId);

    const songs = [];
    await Promise.all(songsId.map(async ({ song_id: songId }) => {
      const data = await this._playlistsService.getSongById(songId);
      const { id: dataId, title, performer } = data;
      const song = { id: dataId, title, performer };
      songs.push(song);
    }));

    const data = {
      playlist: {
        ...playlists,
        songs,
      },
    };

    const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(data));
    console.log(result);
  }
}

module.exports = Listener;

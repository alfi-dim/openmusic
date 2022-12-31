/* eslint-disable camelcase */
const mapDBToModelSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapDBToModelPlaylists = ({ id, name, owner }) => ({
  id,
  name,
  username: owner,
});

const mapDBToModelPlaylistsActivities = ({
  song_id, user_id, action, time,
}) => ({
  username: user_id,
  title: song_id,
  action,
  time,
});

const mapDBToModelAlbum = ({
  id, name, year, cover,
}) => ({
  id, name, year, coverUrl: cover,
});

module.exports = {
  mapDBToModelSongs,
  mapDBToModelPlaylists,
  mapDBToModelPlaylistsActivities,
  mapDBToModelAlbum,
};

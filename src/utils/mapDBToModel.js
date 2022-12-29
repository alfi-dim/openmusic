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

module.exports = { mapDBToModelSongs, mapDBToModelPlaylists };

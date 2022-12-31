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

const mapDBToModelPlaylists = ({ id, name }) => ({
  id,
  name,
});

module.exports = { mapDBToModelSongs, mapDBToModelPlaylists };

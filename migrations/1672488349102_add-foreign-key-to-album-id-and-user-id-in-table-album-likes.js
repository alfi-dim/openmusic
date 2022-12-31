/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('album_likes', 'album_likes_user_id_fkey', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('album_likes', 'album_likes_album_id_fkey', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('album_likes', 'album_likes_user_id_fkey');
  pgm.dropConstraint('album_likes', 'album_likes_album_id_fkey');
};

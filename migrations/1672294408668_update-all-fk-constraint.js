/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // menghapus semua cosntraint fk lama (not on delete cascade)
  pgm.dropConstraint('songs', 'songs_album_id_fkey');
  pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_user_id_fkey');
  pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_song_id_fkey');
  pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_playlist_id_fkey');
  pgm.dropConstraint('collaborations', 'collaborations_user_id_fkey');
  pgm.dropConstraint('collaborations', 'collaborations_playlist_id_fkey');
  pgm.dropConstraint('playlist_songs', 'playlist_songs_playlist_id_fkey');
  pgm.dropConstraint('playlist_songs', 'playlist_songs_song_id_fkey');

  // menambahkan constraint fk baru (on delete cascade)
  pgm.addConstraint('songs', 'songs_album_id_fkey', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'playlist_song_activities_user_id_fkey', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'playlist_song_activities_song_id_fkey', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'playlist_song_activities_playlist_id_fkey', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'collaborations_user_id_fkey', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'collaborations_playlist_id_fkey', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'playlist_songs_playlist_id_fkey', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'playlist_songs_song_id_fkey', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist', 'playlist_owner_users.id_fkey', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'songs_album_id_fkey');
  pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_user_id_fkey');
  pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_song_id_fkey');
  pgm.dropConstraint('playlist_song_activities', 'playlist_song_activities_playlist_id_fkey');
  pgm.dropConstraint('collaborations', 'collaborations_user_id_fkey');
  pgm.dropConstraint('collaborations', 'collaborations_playlist_id_fkey');
  pgm.dropConstraint('playlist_songs', 'playlist_songs_playlist_id_fkey');
  pgm.dropConstraint('playlist_songs', 'playlist_songs_song_id_fkey');
  pgm.dropConstraint('playlist', 'playlist_owner_users.id_fkey');
};

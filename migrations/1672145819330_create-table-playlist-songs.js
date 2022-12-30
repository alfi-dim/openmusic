exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlist"',
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: '"songs"',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};

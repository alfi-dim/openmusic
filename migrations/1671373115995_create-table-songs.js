/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    year: {
      type: 'numeric',
      notNull: true,
    },
    performer: {
      type: 'text',
      notNull: true,
    },
    genre: {
      type: 'text',
      notNull: true,
    },
    duration: {
      type: 'numeric',
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: '"album"',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};

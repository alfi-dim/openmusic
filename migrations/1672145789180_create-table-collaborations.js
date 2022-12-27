/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlist"',
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};

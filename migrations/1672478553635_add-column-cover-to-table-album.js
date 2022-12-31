exports.up = (pgm) => {
  pgm.addColumn('album', {
    cover: {
      type: 'text',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('album', 'cover');
};

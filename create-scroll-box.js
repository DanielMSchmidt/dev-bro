// initializes a box with a label
module.exports = function scrollBox(label) {
  return {
    label: label,
    tags: true,
    scrollable: true,
    scrollbar: {
      ch: ' ',
    },
    border: {
      type: 'line', // or bg
    },
    keys: true,
    vi: true,
    alwaysScroll: true,
    mouse: true,
    style: {
      fg: 'white',
    },
  };
};

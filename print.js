// Prints a single box
module.exports = function print(screen, box, promise) {
  promise.then(
    content => {
      box.style.border.fg = 'green';
      box.content = content + '\n\n\n';
      screen.render();
    },
    ({stdout, stderr}) => {
      box.style.border.fg = 'red';
      box.content = stdout + stderr + '\n\n\n';
      screen.render();
    }
  );
};

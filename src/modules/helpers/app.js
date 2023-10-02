export const on = (flag) => ({
  use: (x) => [flag, x],
});

export const use = (x) => ({
  on: (flag) => [flag, x],
});
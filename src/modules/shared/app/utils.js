import * as rfdc from 'rfdc';

export const keyOf = (o) => {
  return Object.keys(o);
};

export const cloneDeep = rfdc();
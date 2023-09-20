import { latest } from 'immer/dist/internal';

import { AllowedFlags } from 'modules/shared/domain/interfaces';

export const on = <F extends AllowedFlags>(flag: F) => ({
  use: <X>(x: X): [F, X] => [flag, x],
});

/** If you use this way, you're rare */
export const use = <X>(x: X) => ({
  on: <F extends AllowedFlags>(flag: F): [F, X] => [flag, x],
});
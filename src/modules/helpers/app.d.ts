import { AllowedFlags } from 'modules/shared/domain/interfaces';

export declare const on: <F extends AllowedFlags>(flag: F) => {
  use: <X>(x: X) => [F, X];
};

export declare const use: <X>(x: X) => {
  on: <F extends AllowedFlags>(flag: F) => [F, X];
};
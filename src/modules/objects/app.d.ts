import { DUnionKey } from '../shared/domain/constants';

export type customExtract<T, F> = F extends []
  ? Extract<T, { [DUnionKey]?: undefined }>
  : T extends T
    ? _RT.ForceExtract<F, number> extends NonUnknow<_RT.ForceExtract<_RT.ForceExtract<T, DUnionKey>, number>>
      ? T
      : never
    : never;

type NonUnknow<T> = unknown extends T ? never : T;

export type customExtract<T, F, K extends string> = F extends []
  ? Extract<T, { [_ in K]?: undefined }>
  : T extends T
    ? _RT.ForceExtract<F, number> extends NonUnknow<_RT.ForceExtract<_RT.ForceExtract<T, K>, number>>
      ? T
      : never
    : never;

type NonUnknow<T> = unknown extends T ? never : T;
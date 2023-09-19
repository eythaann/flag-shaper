
export type customExtractObj<T, F, K extends string> = F extends []
  ? Extract<T, { [_ in K]?: undefined }>
  : T extends T
    ? _RT.ForceExtract<T, K> extends F
      ? T
      : never
    : never;

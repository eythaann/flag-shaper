export declare const DefaultConfig: {
  keyForOverwrites: 'overwrittenWith';
  createSliceFn: () => {};
  connectFn: () => {};
};

export declare const DUnionKey: unique symbol;
export type DUnionKey = typeof DUnionKey;

export declare const DUnionKeyConnectedState: unique symbol;
export type DUnionKeyConnectedState = typeof DUnionKeyConnectedState;

export declare const DUnionKeyConnectedDispatch: unique symbol;
export type DUnionKeyConnectedDispatch = typeof DUnionKeyConnectedDispatch;
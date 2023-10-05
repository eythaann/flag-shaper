export const DefaultConfig = {
  keyForOverwrites: 'overwrittenWith',
  createSliceFn: () => {},
  connectFn: () => {},
};

export const DUnionKey = Symbol('RT_DISCRIMINATED_UNION_KEY');
export const DUnionKeyConnectedState = Symbol('RT_DISCRIMINATED_UNION_KEY_STATE');
export const DUnionKeyConnectedDispatch = Symbol('RT_DISCRIMINATED_UNION_KEY_DISPATCH');

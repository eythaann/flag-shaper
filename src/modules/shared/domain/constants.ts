import { IConfig } from './interfaces';

// @ts-ignore
export const DefaultConfig: Required<IConfig> = {
  keyForOverwrites: 'overwrittenWith',
  createSliceFn: () => {},
  connectFn: () => {},
} as const;
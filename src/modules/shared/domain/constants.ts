import { IConfig } from './interfaces';

export const DefaultConfig: Required<IConfig> = {
  keyForOverwrites: 'overwrittenWith',
  createSliceFn: () => {},
  connectFn: () => {},
} as const;
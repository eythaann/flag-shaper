import { AnyFunction } from 'readable-types';

export type AllowedFlags = string;
export type FlagCheckerFn<Flag extends AllowedFlags> = (flag: Flag) => boolean; // TODO | (flag: Flag) => Promise<boolean>;

export interface IConfig {
  readonly keyForOverwrites: string;
  readonly createSliceFn: <_S, _R, _N>(...args: any[]) => any;
  readonly connectFn: AnyFunction;
  readonly flags?: string;
}

export const MetadataKey: unique symbol = Symbol('RT_METADATA_KEY');
export type MetadataKey = typeof MetadataKey;

export type Metadata<T = unknown> = {
  [_ in MetadataKey]?: T;
};
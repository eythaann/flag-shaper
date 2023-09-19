import { AnyFunction } from 'readable-types';

export type AllowedFlags = string;
export type FlagCheckerFn<Flag extends AllowedFlags> = (flag: Flag) => boolean; // TODO | (flag: Flag) => Promise<boolean>;

export interface IConfig {
  readonly keyForOverwrites: string;
  readonly createSliceFn: <_S, _R, _N>(...args: any[]) => any;
  readonly connectFn: AnyFunction;
  readonly flags?: string;
}

export interface Metadata<T = unknown> {
  __metadata?: T;
}
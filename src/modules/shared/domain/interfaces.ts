import { AnyObject } from 'readable-types';

export type AllowedFlags = string;
export type FlagChecker<Flag extends AllowedFlags> = (flag: Flag) => boolean; // TODO | (flag: Flag) => Promise<boolean>;

export interface IConfig {
  readonly keyForOverwrites: string;
}

export interface Metadata<T = AnyObject> {
  __metadata?: T;
}
import { MetadataKey } from './constants';

export type AllowedFlags = string;
export type FlagCheckerFn<Flag extends AllowedFlags> = (flag: Flag) => boolean; // TODO | (flag: Flag) => Promise<boolean>;

export type Metadata<T = unknown> = {
  [_ in MetadataKey]?: T;
};
import { IsUnknown, Modify, ModifyByKeyPlusOrderedCombinations, Prettify } from "readable-types";
import { Metadata } from "../shared/domain/interfaces";

type SomeToPartial<T, K extends keyof T> = Omit<T, K> & { [key in K]?: T[K] }

export type ModifyUsingInterface<T, V> = Modify<T, Partial<Metadata<ModifyByKeyPlusOrderedCombinations<T, V>>>>;

type _extractByFlags<
  T,
  V extends [string, ...string[]]
> = { 
  [Key in keyof T as Key extends '__key' ? never : Key]: IsUnknown<_RT.ForceExtract<T[Key], '__metadata'>> extends true 
    ? T[Key] 
    : ExtractByFlags<T[Key], V>
}

export type ExtractByFlags<
  T extends Partial<Metadata<{ __key?: unknown[] }>>,
  V extends [string, ...string[]],
> = Prettify<_extractByFlags<Extract<T['__metadata'], { __key: V }>, V>>
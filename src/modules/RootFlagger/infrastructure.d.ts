import { AnyFunction, AnyObject, IteratorHKT, TupleReduceHKT } from 'readable-types';

import { FlagValidator } from '../checker/infrastructure';
import { FlagShaperForFunctions } from '../functions/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';
import { ApplyFlagsOnType } from './app';

import { AllowedFlags, FlagCheckerFn } from '../shared/domain/interfaces';

declare class FlagShaper_Builder<
  Flags extends AllowedFlags,
  _JSXEnabled = false,
  _ReduxEnabled = false,
> {
  private _JSXEnabled: _JSXEnabled;
  private _ReduxEnabled: _ReduxEnabled;
  public constructor(isFlagEnabled: FlagCheckerFn<Flags>);
  public withJSX(): FlagShaper_Builder<Flags, true, _ReduxEnabled>;
  public withRedux(connectFn: AnyFunction, createSliceFn: AnyFunction): FlagShaper_Builder<Flags, _JSXEnabled, true>;
  public build(): FlagShaper<Flags, _JSXEnabled, _ReduxEnabled>;
}

export declare class FlagShaper<Flag extends AllowedFlags, _JSXEnabled, _ReduxEnabled> extends BaseFlagger<Flag> {
  public readonly validator: FlagValidator<Flag>;
  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag>;
  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag>;
  ///** @alias decorator */
  //public readonly dec: FlagShaperDecorators<Flag>;
  public readonly jsx: [_JSXEnabled] extends [true] ? FlagShaperJSX<Flag> : never;
  public readonly redux: [_ReduxEnabled] extends [true] ? ReduxFlagShaper<Flag> : never;

  private constructor(builder: typeof FlagShaper.Builder);

  public concrete<S extends AnyObject, F extends Flag>(obj: S, flag: F): ApplyFlagsOnType<S, [F]>;
  public concrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(obj: S, flags: F): ApplyFlagsOnType<S, F>;

  public softConcrete<S extends AnyObject, F extends Flag>(obj: S, flag: F): ApplyFlagsOnType<S, [F]> | undefined;
  public softConcrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(obj: S, flags: F): ApplyFlagsOnType<S, F> | undefined;

  public getValueByFlag<T, Over extends [[Flag, unknown], ...[Flag, unknown][]]>(init: T, over: Over): T | getValues<Over>;

  public static Builder: typeof FlagShaper_Builder;
}

interface UnionOfValues extends IteratorHKT.Tuple<[string, unknown]> {
  return: this['acc'] | this['current'][1];
}

// @ts-ignore
type getValues<T extends unknown[]> = TupleReduceHKT<T, UnionOfValues, never>;
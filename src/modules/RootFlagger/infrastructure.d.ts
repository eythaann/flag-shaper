import { AnyObject, IteratorHKT, TupleReduceHKT } from 'readable-types';

import { FlagValidator } from '../checker/infrastructure';
import { FlagShaperDecorators } from '../decorators/infrastructure';
import { FlagShaperForFunctions } from '../functions/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';
import { ApplyFlagsOnType } from './app';

import { AllowedFlags, FlagCheckerFn } from '../shared/domain/interfaces';

export declare class FlagShaper<Flag extends AllowedFlags = string> extends BaseFlagger<Flag> {
  public readonly validator: FlagValidator<Flag>;

  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag>;

  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag>;

  /** @alias decorator */
  public readonly dec: FlagShaperDecorators<Flag>;

  /** @alias redux */
  public readonly rx: ReduxFlagShaper<Flag>;
  public readonly redux: ReduxFlagShaper<Flag>;

  public readonly jsx: FlagShaperJSX<Flag>;

  public constructor(isFlagEnabled: FlagCheckerFn<Flag>);

  public concrete<S extends AnyObject, F extends Flag>(obj: S, flag: F): ApplyFlagsOnType<S, [F]>;
  public concrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(obj: S, flags: F): ApplyFlagsOnType<S, F>;

  public softConcrete<S extends AnyObject, F extends Flag>(obj: S, flag: F): ApplyFlagsOnType<S, [F]> | undefined;
  public softConcrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(obj: S, flags: F): ApplyFlagsOnType<S, F> | undefined;

  public getValueByFlag<T, Over extends [[Flag, unknown], ...[Flag, unknown][]]>(init: T, over: Over): T | getValues<Over>;
}

interface UnionOfValues extends IteratorHKT.Tuple<[string, unknown]> {
  return: this['acc'] | this['current'][1];
}

// @ts-ignore
type getValues<T extends unknown[]> = TupleReduceHKT<T, UnionOfValues, never>;
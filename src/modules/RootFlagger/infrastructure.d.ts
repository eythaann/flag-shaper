import { AnyObject, IteratorHKT, TupleReduceHKT } from 'readable-types';

import { FlagValidator } from '../checker/infrastructure';
import { FlagShaperDecorators } from '../decorators/infrastructure';
import { FlagShaperForFunctions } from '../functions/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';
import { ApplyFlagsOnType } from './app';

import { DefaultConfig } from '../shared/domain/constants';
import { AllowedFlags, FlagCheckerFn, IConfig } from '../shared/domain/interfaces';

export declare class FlagShaper<Flag extends AllowedFlags = string, Config extends IConfig = typeof DefaultConfig> extends BaseFlagger<Flag, Config> {
  public readonly validator: FlagValidator<Flag>;
  public readonly config: Config;

  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag, Config>;

  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag, Config>;

  /** @alias decorator */
  public readonly dec: FlagShaperDecorators<Flag, Config>;

  /** @alias redux */
  public readonly rx: ReduxFlagShaper<Flag, Config>;
  public readonly redux: ReduxFlagShaper<Flag, Config>;

  public readonly jsx: FlagShaperJSX<Flag, Config>;

  public constructor(isFlagEnabled: FlagCheckerFn<Flag>, config: Readonly<Config>);

  public concrete<S extends AnyObject, F extends Flag>(obj: S, flag: F): ApplyFlagsOnType<{ config: Config }, S, [F]>;
  public concrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(obj: S, flags: F): ApplyFlagsOnType<{ config: Config }, S, F>;

  public softConcrete<S extends AnyObject, F extends Flag>(obj: S, flag: F): ApplyFlagsOnType<{ config: Config }, S, [F]> | undefined;
  public softConcrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(obj: S, flags: F): ApplyFlagsOnType<{ config: Config }, S, F> | undefined;

  public getValueByFlag<T, Over extends [[Flag, unknown], ...[Flag, unknown][]]>(init: T, over: Over): T | getValues<Over>;
}

interface UnionOfValues extends IteratorHKT.Tuple<[string, unknown]> {
  return: this['acc'] | this['current'][1];
}

// @ts-ignore
type getValues<T extends unknown[]> = TupleReduceHKT<T, UnionOfValues, never>;
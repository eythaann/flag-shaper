import { AnyObject, IteratorHKT, TupleReduceHKT } from 'readable-types';

import { FlagShaperForFunctions } from 'modules/functions/infrastructure';
import { FlagValidator } from '../checker/infrastructure';
import { FlagShaperDecorators } from '../decorators/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/Flagger/infrastructure';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';
import { ExtractByFlags } from './app';

import { DefaultConfig } from 'modules/shared/domain/constants';
import { AllowedFlags, FlagCheckerFn, IConfig } from 'modules/shared/domain/interfaces';

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

  public concrete<S extends AnyObject, F extends Flag>(state: S, flag: F): ExtractByFlags<{ config: Config }, S, [F]>;
  public concrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(state: S, flags: F): ExtractByFlags<{ config: Config }, S, F>;

  public getValueByFlag<T, Over extends [[Flag, unknown], ...[Flag, unknown][]]>(init: T, over: Over): T | getValues<Over>;
}

interface UnionOfValues extends IteratorHKT.Tuple<[string, unknown]> {
  return: this['acc'] | this['current'][1];
}

// @ts-ignore
type getValues<T extends unknown[]> = TupleReduceHKT<T, UnionOfValues, never>;
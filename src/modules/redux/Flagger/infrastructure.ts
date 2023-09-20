import type { JSXElementConstructor, ReactNode } from 'react';
import { AnyObject, Prettify } from 'readable-types';

import { createSelectorBuilder } from '../SelectorBuilder/infrastructure';
import { createSliceTools } from '../SliceTools/infrastructure';

import { BaseFlagger } from '@shared/BaseFlagger/app';
import { ExtractByFlags } from './app';

import { AllowedFlags, IConfig } from '@shared/domain/interfaces';
import { FlaggedPropsAndState } from '@modules/jsx/domain';

export class ReduxFlagShaper<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  public getSelectorBuilder<State extends AnyObject>() {
    return createSelectorBuilder<State>();
  };

  public getSliceTools<State extends AnyObject>() {
    return createSliceTools<State, Flag, Config>(this.config.createSliceFn, this.validator);
  }

  public connect<
    T extends FlaggedPropsAndState,
  >(...args: [
    mapStateToProps: (state: any, ownProps: T['ExternalProps']) => T['ReduxStateProps'],
    mapDispatchToProps?: T['ReduxDispatchProps'],
    mergeProps?: any,
    options?: any
  ]) {
    return (component: JSXElementConstructor<T['completeProps']>) => {
      return this.config.connectFn(args)(component) as JSXElementConstructor<Prettify<T['ExternalProps'] & { children: ReactNode }>>;
    };
  }

  concrete<S extends AnyObject, F extends Flag>(state: S, flag: F): ExtractByFlags<{ config: Config }, S, [F]>;
  concrete<S extends AnyObject, F extends [Flag, ...Flag[]]>(state: S, flags: F): ExtractByFlags<{ config: Config }, S, F>;
  public concrete(state: any, flags: Flag | Flag[]): any {
    if (!this.validator.allFlagsAreEnabled(flags)) {
      const flagsString = [flags].flat().join(', ');
      throw new Error(`You are trying to concrete an object with [${flagsString}], but these are not enabled`);
    }
    return state;
  }
}
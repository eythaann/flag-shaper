import type { JSXElementConstructor, ReactNode } from 'react';
import { AnyObject, Prettify } from 'readable-types';

import { createSelectorBuilder } from '../SelectorBuilder/infrastructure';
import { SliceTools } from '../SliceTools/infrastructure';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';
import { FlaggedPropsAndState } from 'modules/jsx/domain';

export class ReduxFlagShaper<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  public getSelectorBuilder<State extends AnyObject>() {
    return createSelectorBuilder<State>();
  };

  public getSliceTools<State extends AnyObject>() {
    return new SliceTools<State, Flag, Config>(this.validator, this.config);
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
  };
}
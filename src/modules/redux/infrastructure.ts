import { JSXElementConstructor } from 'react';
import { AnyObject } from 'readable-types';

import { FlaggedPropsAndState } from '@modules/jsx/infrastructure';
import { createSelectorBuilder } from './SelectorBuilder/infrastructure';
import { createSliceTools } from './SliceTools/infrastructure';

import { BaseFlagger } from '@shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from '@shared/domain/interfaces';

export class ReduxFlagShaper<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  public getSelectorBuilder<State extends AnyObject>() {
    return createSelectorBuilder<State>();
  };

  public getSliceTools<State extends AnyObject>() {
    return createSliceTools<State, Flag>(this.config.createSliceFn, this.checker);
  }

  public connect<
    T extends FlaggedPropsAndState,
  >(...args: [
    mapStateToProps: (state: any, ownProps: T['ExternalProps']) => T['ReduxStateProps'],
    mapDispatchToProps?: any,
    mergeProps?: any,
    options?: any
  ]) {
    return (component: JSXElementConstructor<T['completeProps']>) => this.config.connectFn(args)(component) as JSXElementConstructor<T['ExternalProps']>;
  }
}
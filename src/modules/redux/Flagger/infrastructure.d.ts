import type { JSXElementConstructor, ReactNode } from 'react';
import { AnyObject, Prettify } from 'readable-types';

import { SelectorBuilder } from '../SelectorBuilder/infrastructure';
import { SliceTools } from '../SliceTools/infrastructure';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';
import { FlaggedPropsAndState } from 'modules/jsx/domain';

export declare class ReduxFlagShaper<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  public getSelectorBuilder<State extends AnyObject>(): SelectorBuilder<State>;

  public getSliceTools<State extends AnyObject>(): SliceTools<State, Flag, Config>;

  public connect<T extends FlaggedPropsAndState>(...args: [
    mapStateToProps: (state: any, ownProps: T['ExternalProps']) => T['ReduxStateProps'],
    mapDispatchToProps?: T['ReduxDispatchProps'],
    mergeProps?: any,
    options?: any
  ]): (component: JSXElementConstructor<T['completeProps']>) => JSXElementConstructor<Prettify<T['ExternalProps'] & { children: ReactNode }>>;
}
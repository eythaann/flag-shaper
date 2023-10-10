import type { JSXElementConstructor, ReactNode } from 'react';
import { AnyFunction, AnyObject, Prettify } from 'readable-types';

import { SelectorBuilder } from './SelectorBuilder/infrastructure';
import { SliceTools } from './SliceTools/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

import { FlaggedPropsAndState } from '../jsx/domain';
import { AllowedFlags } from '../shared/domain/interfaces';

export declare class ReduxFlagShaper<Flag extends AllowedFlags> extends BaseFlagger<Flag> {
  private _connect: AnyFunction;
  private _createSlice: AnyFunction;

  public constructor(...args: [...args: ConstructorParameters<typeof BaseFlagger>, connectFn: AnyFunction, createSliceFn: AnyFunction]);

  public getSelectorBuilder<State extends AnyObject>(): SelectorBuilder<State>;

  public getSliceTools<State extends AnyObject>(): SliceTools<State, Flag>;

  public connect<T extends FlaggedPropsAndState>(...args: [
    mapStateToProps: (state: any, ownProps: T['ExternalProps']) => T['ReduxStateProps'],
    mapDispatchToProps?: T['ReduxDispatchProps'],
    mergeProps?: any,
    options?: any
  ]): (component: JSXElementConstructor<T['completeProps']>) => JSXElementConstructor<Prettify<T['ExternalProps'] & { children: ReactNode }>>;
}
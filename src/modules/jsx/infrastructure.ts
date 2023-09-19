import { JSXElementConstructor } from 'react';

import { BaseFlagger } from '@shared/BaseFlagger/app';

import { AllowedFlags, IConfig, Metadata } from '@shared/domain/interfaces';

export interface ConfigToConnect {
  props?: {};
  propsOverwrites?: [[string, {}], ...[string, {}][]];
  internalState?: {};
  internalStateOverwrites?: [[string, {}], ...[string, {}][]];
  stateProps?: {};
  statePropsOverwrites?: [[string, {}], ...[string, {}][]];
  dispatchProps?: {};
  dispatchPropsOverwrites?: [[string, {}], ...[string, {}][]];
}

export interface FlaggedPropsAndState extends Metadata<ConfigToConnect> {
  ExternalProps: {};
  InternalState: {};
  ReduxStateProps: {};
  ReduxDispatchProps: {};
  completeProps: {};
}

export class FlagShaperJSX<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  enableComponentIn<T>(
    flag: Flag | Flag[],
    component: JSXElementConstructor<T>,
  ): JSXElementConstructor<T> {
    if (this.checker.someFlagIsEnabled(flag)) {
      return component;
    }
    return () => null;
  }
};
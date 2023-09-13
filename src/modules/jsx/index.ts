import { Component, JSXElementConstructor } from "react";
import { FlagShaperChecker } from "../checker";
import { AllowedFlags, FlagChecker, IConfig } from "../shared/domain/interfaces";
import { AnyFunction, AnyObject, EmptyObject, If, KeyOfObject, Modify, ModifyByKeyPlusOrderedCombinations } from "readable-types";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface ConfigToConnect {
  props?: {},
  propsOverwrites?: [[string, {}], ...[string, {}][]],
  internalState?: {},
  internalStateOverwrites?: [[string, {}], ...[string, {}][]],
  stateProps?: {},
  statePropsOverwrites?: [[string, {}], ...[string, {}][]],
  dispatchProps?: {},
  dispatchPropsOverwrites?: [[string, {}], ...[string, {}][]],
}

export interface FlaggedPropsAndState {
  __metadata: ConfigToConnect;
  ExternalProps: {};
  InternalState: {};
  ReduxStateProps: {};
  ReduxDispatchProps: {};
  completeProps: {};
}

export class FlagShaperJSX<Flag extends AllowedFlags, Config extends IConfig> extends FlagShaperChecker<Flag, Config> {
  enableComponentIn<T>(
    flag: Flag | Flag[],
    component: JSXElementConstructor<T>,
  ): JSXElementConstructor<T> {
    if (this.someFlagIsEnabled(flag)) return component;
    return () => null;
  }

  Component = class ComponentWithFlags<
    Props extends AnyObject = EmptyObject,
    PropsOverwrites extends [[Flag, AnyObject], ...[Flag, AnyObject][]] | [] = [],
    State extends AnyObject = EmptyObject,
    StateOverwrites extends [[Flag, AnyObject], ...[Flag, AnyObject][]] | [] = [],
    SS = any,
    realProps = ModifyByKeyPlusOrderedCombinations<Props, PropsOverwrites, Config['keyForOverwrites']>,
    realState = ModifyByKeyPlusOrderedCombinations<State, StateOverwrites, Config['keyForOverwrites']>
  > extends Component<realProps, realState, SS> {
  
  /* protected isFlagEnabled<T extends Flag>(flag: T, o: Prettify<GetProps<Props, PropsOverwrites>> | Prettify<GetProps<State, StateOverwrites>>): o is typeof o & { flagToUse: T } {
    return o.flagToUse === flag && isFlagEnabled(flag);
  } */
  
  }
};

export const FSConnectCreator = (connect: AnyFunction) => <
    T extends FlaggedPropsAndState, 
  >(...args: [
    mapStateToProps: (state: any, ownProps: T['ExternalProps']) => T['ReduxStateProps'],
    mapDispatchToProps?: any,
    mergeProps?: any,
    options?: any
  ]) => (component: JSXElementConstructor<T['completeProps']>) => connect(args)(component) as JSXElementConstructor<T['ExternalProps']>;
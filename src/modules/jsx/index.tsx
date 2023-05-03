import { Component, JSXElementConstructor } from "react";
import { FlagShaperChecker } from "../checker";
import { AllowedFlags, FlagChecker } from "../shared/interfaces";
import { EmptyObject, AnyObject } from 'readable-types';

export class FlagShaperJSX<Flag extends AllowedFlags> extends FlagShaperChecker<Flag> {

  enableComponentIn<T>(flag: Flag | Flag[], component: JSXElementConstructor<T>): JSXElementConstructor<T> {
    if (this.someFlagIsEnabled(flag)) return component;
    return () => null;
  }

  Component = class ComponentWithFlags<
    Props = EmptyObject,
    PropsOverrides extends { [key in Flag]?: AnyObject } = EmptyObject,
    State = EmptyObject,
    SS = any,
  > extends Component<Props, State, SS> {






  };
}





type tprop = {
  prop1: string;
}
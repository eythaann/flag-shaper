import { Component, JSXElementConstructor } from "react";
import { FlagShaperChecker } from "../checker";
import { AllowedFlags, FlagChecker } from "../shared/interfaces";
import { AnyObject, EmptyObject, If, KeyOfObject, Modify } from "readable-types";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const FlagShaperJSX = <Flag extends AllowedFlags>(
  isFlagEnabled: FlagChecker<Flag>,
) => {
  const checker = new FlagShaperChecker(isFlagEnabled);

  type GetProps<
    Props extends AnyObject,
    Overrides extends { [key in Flag]?: AnyObject },
    _keys extends keyof Overrides = keyof Overrides,
  > =
    | ({ flagToUse?: undefined } & Props)
    | (
      _keys extends _keys 
        ? { flagToUse: _keys } & Modify<Props, Overrides[_keys]>
        : never
    );


  return {
    enableComponentIn<T>(
      flag: Flag | Flag[],
      component: JSXElementConstructor<T>,
    ): JSXElementConstructor<T> {
      if (checker.someFlagIsEnabled(flag)) return component;
      return () => null;
    },

    Component: class ComponentWithFlags<
      Props extends AnyObject = EmptyObject,
      PropsOverrides extends { [key in Flag]?: AnyObject } = EmptyObject,
      State extends AnyObject = EmptyObject,
      StateOverrides extends { [key in Flag]?: AnyObject } = EmptyObject,
      SS = any,
    > extends Component<
      Prettify<GetProps<Props, PropsOverrides>>,
      Prettify<GetProps<State, StateOverrides>>,
      SS
    > {

      protected isFlagEnabled<T extends Flag>(flag: T, o: Prettify<GetProps<Props, PropsOverrides>> | Prettify<GetProps<State, StateOverrides>>): o is typeof o & { flagToUse: T } {
        return o.flagToUse === flag && isFlagEnabled(flag);
      }
      
    },
  };
};


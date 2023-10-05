import { JSXElementConstructor, PropsWithChildren, ReactNode } from 'react';
import { AnyObject } from 'readable-types';

import { ApplyFlagsOnType } from '../RootFlagger/app';
import { BaseFlagger } from '../shared/BaseFlagger/app';

import { DUnionKey } from '../shared/domain/constants';
import { AllowedFlags, IConfig } from '../shared/domain/interfaces';

export declare class FlagShaperJSX<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  Toggle(props: { flags: Flag | Flag[]; on: JSX.Element; off: JSX.Element }): JSX.Element;

  RenderIn(props: { flags: Flag | Flag[]; children: ReactNode }): JSX.Element | null;
  RenderIn<F extends [Flag, ...Flag[]], P extends AnyObject>(props: {
    flags: F;
    component: JSXElementConstructor<P>;
    props: ApplyFlagsOnType<P, F>;
  }): JSX.Element | null;

  UnRenderIn(props: PropsWithChildren<{ [DUnionKey]: Flag | Flag[] }>): JSX.Element | null;
  enableComponentIn<T>(flag: Flag | Flag[], component: JSXElementConstructor<T>): JSXElementConstructor<T>;
}
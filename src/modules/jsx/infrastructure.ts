import { JSXElementConstructor } from 'react';

import { BaseFlagger } from '@shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from '@shared/domain/interfaces';

export class FlagShaperJSX<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  enableComponentIn<T>(
    flag: Flag | Flag[],
    component: JSXElementConstructor<T>,
  ): JSXElementConstructor<T> {
    if (this.validator.someFlagIsEnabled(flag)) {
      return component;
    }
    return () => null;
  }
};
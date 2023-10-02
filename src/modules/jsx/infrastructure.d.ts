import { JSXElementConstructor } from 'react';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

export declare class FlagShaperJSX<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  enableComponentIn<T>(flag: Flag | Flag[], component: JSXElementConstructor<T>): JSXElementConstructor<T>;
}
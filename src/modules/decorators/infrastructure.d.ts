import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

export declare class FlagShaperDecorators<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {}
import { BaseFlagger } from '@shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from '@shared/domain/interfaces';

export class FlagShaperDecorators<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {

}
import { BaseFlagger } from '../shared/BaseFlagger/app';

import { AllowedFlags } from '../shared/domain/interfaces';

export declare class FlagShaperDecorators<Flag extends AllowedFlags> extends BaseFlagger<Flag> {}
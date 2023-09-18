import { FlagShaperChecker } from '../checker/index';
import { AllowedFlags, IConfig } from '../shared/domain/interfaces';

export class FlagShaperDecorators<Flag extends AllowedFlags, Config extends IConfig> extends FlagShaperChecker<Flag, Config> {

}
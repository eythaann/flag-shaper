import { FlagShaperChecker } from "../checker/index";
import { AllowedFlags } from "../shared/interfaces";

export class FlagShaperDecorators<Flag extends AllowedFlags> extends FlagShaperChecker<Flag> {
  
}
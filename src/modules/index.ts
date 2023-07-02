import { FlagShaperDecorators } from "./decorators";
import { FlagShaperForFunctions } from "./functions/index";
import { FlagShaperJSX } from "./jsx";
import { FlagShaperForObjects } from "./objects/index";
import { AllowedFlags, FlagChecker } from "./shared/interfaces";


export class FlagShaper<Flag extends AllowedFlags = string> {
  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag>;
  public readonly function: FlagShaperForFunctions<Flag>;

  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag>;
  public readonly object: FlagShaperForObjects<Flag>;

  /** @alias decorator */
  public readonly dec: FlagShaperDecorators<Flag>;
  public readonly decorator: FlagShaperDecorators<Flag>;

  public readonly jsx: ReturnType<typeof FlagShaperJSX>;

  constructor(isFlagEnabled: FlagChecker<Flag>) {
    this.function = new FlagShaperForFunctions(isFlagEnabled);
    this.object = new FlagShaperForObjects(isFlagEnabled);
    this.decorator = new FlagShaperDecorators(isFlagEnabled);
    this.jsx = FlagShaperJSX(isFlagEnabled);

    this.fn = this.function;
    this.obj = this.object;
    this.dec = this.decorator;
  }
}

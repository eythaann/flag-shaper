import { FlagShaperDecorators } from "./decorators";
import { FlagShaperForFunctions } from "./functions/index";
import { FlagShaperForObjects } from "./objects/index";
import { FlagChecker } from "./shared/interfaces";


export class FlagShaper<Flag extends string = string> {
  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag>;
  public readonly function: FlagShaperForFunctions<Flag>;

  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag>;
  public readonly object: FlagShaperForObjects<Flag>;

  /** @alias decorator */
  public readonly dec: FlagShaperDecorators<Flag>;
  public readonly decorator: FlagShaperDecorators<Flag>;


  constructor(isFlagEnabled: FlagChecker<Flag>) {
    this.function = new FlagShaperForFunctions(isFlagEnabled);
    this.object = new FlagShaperForObjects(isFlagEnabled);
    this.decorator = new FlagShaperDecorators(isFlagEnabled)

    this.fn = this.function;
    this.obj = this.object;
    this.dec = this.decorator;
  }
}

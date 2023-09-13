import { FlagShaperDecorators } from "./decorators";
import { FlagShaperForFunctions } from "./functions/index";
import { FlagShaperJSX } from "./jsx";
import { FlagShaperForObjects } from "./objects/index";
import { DefaultConfig } from "./shared/domain/constants";
import { AllowedFlags, FlagChecker, IConfig } from "./shared/domain/interfaces";


export class FlagShaper<
  Flag extends AllowedFlags = string,
  Config extends IConfig = typeof DefaultConfig,
> {
  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag, Config>;
  public readonly function: FlagShaperForFunctions<Flag, Config>;

  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag, Config>;
  public readonly object: FlagShaperForObjects<Flag, Config>;

  /** @alias decorator */
  public readonly dec: FlagShaperDecorators<Flag, Config>;
  public readonly decorator: FlagShaperDecorators<Flag, Config>;

  public readonly jsx: FlagShaperJSX<Flag, Config>;

  constructor(isFlagEnabled: FlagChecker<Flag>, config: Readonly<Config> = DefaultConfig as Config) {
    this.function = new FlagShaperForFunctions(isFlagEnabled, config);
    this.object = new FlagShaperForObjects(isFlagEnabled, config);
    this.decorator = new FlagShaperDecorators(isFlagEnabled, config);
    this.jsx = new FlagShaperJSX(isFlagEnabled, config);

    this.fn = this.function;
    this.obj = this.object;
    this.dec = this.decorator;
  }
}

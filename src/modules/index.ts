import { FlagShaperDecorators } from "./decorators";
import { FlagShaperForFunctions } from "./functions/index";
import { FlagShaperJSX } from "./jsx";
import { FlagShaperForObjects } from "./objects/index";
import { ReduxFlagShaper } from "./redux/infra";
import { DefaultConfig } from "./shared/domain/constants";
import { AllowedFlags, FlagChecker, IConfig } from "./shared/domain/interfaces";


export class FlagShaper<
  Flag extends AllowedFlags = string,
  Config extends IConfig = typeof DefaultConfig,
> {
  /** @alias function */
  readonly fn: FlagShaperForFunctions<Flag, Config>;
  readonly function: FlagShaperForFunctions<Flag, Config>;

  /** @alias object */
  readonly obj: FlagShaperForObjects<Flag, Config>;
  readonly object: FlagShaperForObjects<Flag, Config>;

  /** @alias decorator */
  readonly dec: FlagShaperDecorators<Flag, Config>;
  readonly decorator: FlagShaperDecorators<Flag, Config>;

  readonly jsx: FlagShaperJSX<Flag, Config>;

  readonly redux: ReduxFlagShaper<Flag, Config>;

  public constructor(isFlagEnabled: FlagChecker<Flag>, config: Readonly<Config> = DefaultConfig as Config) {
    this.function = new FlagShaperForFunctions(isFlagEnabled, config);
    this.object = new FlagShaperForObjects(isFlagEnabled, config);
    this.decorator = new FlagShaperDecorators(isFlagEnabled, config);
    this.jsx = new FlagShaperJSX(isFlagEnabled, config);
    this.redux = new ReduxFlagShaper(isFlagEnabled, config);

    this.fn = this.function;
    this.obj = this.object;
    this.dec = this.decorator;
  }
}

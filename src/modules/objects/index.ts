import { AnyObject, HasProperty, ModifyByKeyPlusOrderedCombinations } from 'readable-types';
import { FlagShaperChecker } from '../checker/index';
import { ExtractByFlags } from '../redux/app';
import { ReduxMetadata } from '../redux/domain';
import { AllowedFlags, IConfig, Metadata } from '../shared/domain/interfaces';
import { customExtractObj } from './app';

export class FlagShaperForObjects<Flag extends AllowedFlags, Config extends IConfig> extends FlagShaperChecker<Flag, Config> {
  public overwriteOnDeclaration<
    Obj extends AnyObject,
    Over extends [[Flag, AnyObject], ...[Flag, AnyObject][]]
  >(obj: Obj, overrides: Over): ModifyByKeyPlusOrderedCombinations<Obj, Over, Config['keyForOverwrites']> & {};

  public overwriteOnDeclaration<
    objWithMetadata extends Metadata<{ keyToMainObj: string; keyToOverwrites: string }>,
    _metadata extends objWithMetadata['__metadata'] = objWithMetadata['__metadata'],
    Obj = _RT.ForceExtract<_metadata, _metadata['keyToMainObj']>,
    Over = _RT.ForceExtract<_metadata, _metadata['keyToOverwrites']>,
  >(obj: Obj, overrides: Over): ModifyByKeyPlusOrderedCombinations<Obj, Over, Config['keyForOverwrites']> & {};

  public overwriteOnDeclaration(obj: any, overrides: any): any {
    const newObject: any = obj;

    overrides.forEach(([flag, override]: [Flag, AnyObject]) => {
      if (!this.isFlagEnabled(flag)) {
        return;
      }

      Object.assign(newObject, override);
      newObject[this.config.keyForOverwrites] ??= [];
      newObject[this.config.keyForOverwrites].push(flag);
    });

    return newObject;
  }

  public wasObjectDeclaredWith<
    Obj extends { [_ in Config['keyForOverwrites']]?: AllowedFlags[] },
    Flags extends [Flag, ...Flag[]] | [] = [],
  >(obj: Obj, flags?: Flags): obj is customExtractObj<Obj, Flags, Config['keyForOverwrites']>;

  public wasObjectDeclaredWith(obj: AnyObject, flags: Flag[] = []): boolean {
    if (flags.length === 0) {
      return !obj[this.config.keyForOverwrites];
    }
    return obj[this.config.keyForOverwrites] && flags.every((flag) => obj[this.config.keyForOverwrites].includes(flag));
  }

  public setOverridesToObject<
    Obj extends AnyObject,
    Over extends [[Flag, AnyObject], ...[Flag, AnyObject][]]
  >(obj: Obj, over: Over) {
    Object.defineProperty(obj, 'getOverwrittenObject', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: () => this.overwriteOnDeclaration(obj, over),
    });

    return obj as Obj & { getOverwrittenObject(): ModifyByKeyPlusOrderedCombinations<Obj, Over, Config['keyForOverwrites']> & {} };
  }
}
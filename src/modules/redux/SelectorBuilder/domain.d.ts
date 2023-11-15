import { _RT, $, AnyObject, HasProperty, IsUnknown, KeysOfUnion, nLengthTuple, NonUndefined, TupleReduce } from 'readable-types';

import { MetadataKey } from '../../shared/domain/constants';
import { Metadata } from '../../shared/domain/interfaces';

interface $ExtractTypeFormPath extends $<{ acc: unknown; current: unknown }> {
  return: _RT.ForceExtract<this['acc'], this['current']>;
}

type SelectorByFlag<State extends AnyObject, Path extends nLengthTuple> = (
  <S extends IsUnknown<State[MetadataKey]> extends false
    ? S[MetadataKey] extends State[MetadataKey]
      ? Metadata<State[MetadataKey]>
      : Required<Metadata<State[MetadataKey]>>
    : State
  >(state: S) => TupleReduce<Path, $ExtractTypeFormPath, S>
) & Metadata<Path>;

export type getAllPosibleKeys<
  State,
  Fn extends Metadata<nLengthTuple<string>>,
  R = TupleReduce<NonUndefined<Fn[MetadataKey]>, $ExtractTypeFormPath, State>
> = HasProperty<R, MetadataKey> extends false
  ? keyof R
  : Exclude<KeysOfUnion<_RT.ForceExtract<NonUndefined<_RT.ForceExtract<R, MetadataKey>>, 'types'>>, 'flagToUse'>;
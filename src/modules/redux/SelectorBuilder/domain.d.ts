import { AnyObject, HasProperty, IsUnknown, IteratorHKT, KeysOfUnion, NonUndefined, TupleReduceHKT } from 'readable-types';

import { Metadata, MetadataKey } from '../../shared/domain/interfaces';

interface extractTypeFormPath<state> extends IteratorHKT.Tuple {
  initialAcc: state;
  return: _RT.ForceExtract<this['acc'], this['current']>;
}

type SelectorByFlag<State extends AnyObject, Path extends unknown[]> = (
  <S extends IsUnknown<State[MetadataKey]> extends false
    ? S[MetadataKey] extends State[MetadataKey]
      ? Metadata<State[MetadataKey]>
      : Required<Metadata<State[MetadataKey]>>
    : State
  // @ts-ignore
  >(state: S) => TupleReduceHKT<Path, extractTypeFormPath<S>>
) & Metadata<Path>;

export type getAllPosibleKeys<
  State,
  Fn extends Metadata<string[]>,
  // @ts-ignore
  R = TupleReduceHKT<NonUndefined<Fn[MetadataKey]>, extractTypeFormPath<State>>
> = HasProperty<R, MetadataKey> extends false
  ? keyof R
  : Exclude<KeysOfUnion<_RT.ForceExtract<NonUndefined<_RT.ForceExtract<R, MetadataKey>>, 'types'>>, 'flagToUse'>;
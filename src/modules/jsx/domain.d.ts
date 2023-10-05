import { AnyObject, If, IsUndefined, IsUnknown, IteratorHKT, Modify, ModifyByKeyPlusOrderedCombinations, NonUndefined, Or, TupleIncludes, TupleReduceHKT } from 'readable-types';

import { CreateFlaggedInterface } from '../RootFlagger/app';

import { DUnionKey } from '../shared/domain/constants';
import { IConfig, Metadata, MetadataKey } from '../shared/domain/interfaces';

export interface ConfigToConnect {
  props?: AnyObject;
  propsOverwrites?: [[string, AnyObject], ...[string, AnyObject][]];
  internalState?: AnyObject;
  internalStateOverwrites?: [[string, AnyObject], ...[string, AnyObject][]];
  stateProps?: AnyObject;
  statePropsOverwrites?: [[string, AnyObject], ...[string, AnyObject][]];
  dispatchProps?: AnyObject;
  dispatchPropsOverwrites?: [[string, AnyObject], ...[string, AnyObject][]];
}

export interface FlaggedPropsAndState extends Metadata<ConfigToConnect> {
  ExternalProps: {};
  InternalState: {};
  ReduxStateProps: {};
  ReduxDispatchProps: {};
  completeProps: {};
}

interface testR2<KeyToFilter> extends IteratorHKT.Tuple<[string, AnyObject]> {
  initialAcc: {};
  return: KeyToFilter extends this['current'][0]
    ? Modify<this['acc'], this['current'][1]>
    : this['acc'];
}

interface testR1 extends IteratorHKT.Tuple<[string, AnyObject], [string, AnyObject][]> {
  initialAcc: [];
  return: TupleIncludes<this['acc'], [this['current'][0], AnyObject]> extends true
    ? this['acc']
    // @ts-ignore
    : [...this['acc'], [this['current'][0], TupleReduceHKT<this['tuple'], testR2<this['current'][0]>>]];
}

type DefaultValue<T, Default> = If<Or<[IsUnknown<T>, IsUndefined<T>]>, Default, T>;

export type MagnifigThing<
  T extends ConfigToConnect,
> = {
  [MetadataKey]: T;

  ExternalProps: CreateFlaggedInterface<T['props'], NonUndefined<T['propsOverwrites']>>;
  OwnProps: ModifyByKeyPlusOrderedCombinations<T['props'], NonUndefined<T['propsOverwrites']>, DUnionKey>;
  InternalState: ModifyByKeyPlusOrderedCombinations<T['internalState'], NonUndefined<T['internalStateOverwrites']>, DUnionKey>;
  ReduxStateProps: ModifyByKeyPlusOrderedCombinations<T['stateProps'], NonUndefined<T['statePropsOverwrites']>, DUnionKey>;
  ReduxDispatchProps: ModifyByKeyPlusOrderedCombinations<T['dispatchProps'], NonUndefined<T['dispatchPropsOverwrites']>, DUnionKey>;

  completeProps: ModifyByKeyPlusOrderedCombinations<
  Modify<Modify<T['props'], T['stateProps']>, T['dispatchProps']>,
  // @ts-ignore
  TupleReduceHKT<[
    // @ts-ignore
    ...DefaultValue<T['propsOverwrites'], []>,
    ...DefaultValue<T['statePropsOverwrites'], []>,
    ...DefaultValue<T['dispatchPropsOverwrites'], []>,
  ], testR1>,
  DUnionKey
  >;
};
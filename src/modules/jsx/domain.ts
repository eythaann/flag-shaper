import { AnyObject, If, IsUndefined, IsUnknown, IteratorHKT, Modify, ModifyByKeyPlusOrderedCombinations, NonUndefined, Or, TupleIncludes, TupleReduceHKT } from 'readable-types';

import { IConfig, Metadata } from 'modules/shared/domain/interfaces';

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
    : [...this['acc'], [this['current'][0], TupleReduceHKT<this['tuple'], testR2<this['current'][0]>>]];
}

type DefaultValue<T, Default> = If<Or<[IsUnknown<T>, IsUndefined<T>]>, Default, T>;

export interface MagnifigThing<
  Shapper extends { config: IConfig },
  T extends ConfigToConnect,
  Key extends string = Shapper['config']['keyForOverwrites']
> {
  __metadata: T;

  ExternalProps: ModifyByKeyPlusOrderedCombinations<T['props'], NonUndefined<T['propsOverwrites']>, Key>;
  InternalState: ModifyByKeyPlusOrderedCombinations<T['internalState'], NonUndefined<T['internalStateOverwrites']>, Key>;
  ReduxStateProps: ModifyByKeyPlusOrderedCombinations<T['stateProps'], NonUndefined<T['statePropsOverwrites']>, Key>;
  ReduxDispatchProps: ModifyByKeyPlusOrderedCombinations<T['dispatchProps'], NonUndefined<T['dispatchPropsOverwrites']>, Key>;

  completeProps: ModifyByKeyPlusOrderedCombinations<
  Modify<Modify<T['props'], T['stateProps']>, T['dispatchProps']>,
  TupleReduceHKT<[
    ...DefaultValue<T['propsOverwrites'], []>,
    ...DefaultValue<T['statePropsOverwrites'], []>,
    ...DefaultValue<T['dispatchPropsOverwrites'], []>,
  ], testR1>,
  Key
  >;
}
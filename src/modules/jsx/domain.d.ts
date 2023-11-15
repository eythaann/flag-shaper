import { $, AnyObject, If, IsUndefined, IsUnknown, Modify, ModifyByKeyPlusOrderedCombinations, nLengthTuple, NonUndefined, Or, TupleIncludes, TupleReduce } from 'readable-types';

import { CreateFlaggedInterface } from '../RootFlagger/app';

import { DUnionKey, MetadataKey } from '../shared/domain/constants';
import { Metadata } from '../shared/domain/interfaces';

export interface ConfigToConnect {
  props?: AnyObject;
  propsOverwrites?: nLengthTuple<[string, AnyObject]>;
  internalState?: AnyObject;
  internalStateOverwrites?: nLengthTuple<[string, AnyObject]>;
  stateProps?: AnyObject;
  statePropsOverwrites?: nLengthTuple<[string, AnyObject]>;
  dispatchProps?: AnyObject;
  dispatchPropsOverwrites?: nLengthTuple<[string, AnyObject]>;
}

export interface FlaggedPropsAndState extends Metadata<ConfigToConnect> {
  ExternalProps: {};
  InternalState: {};
  ReduxStateProps: {};
  ReduxDispatchProps: {};
  completeProps: {};
}

interface $testR2<KeyToFilter> extends $<{ current: [string, AnyObject]; acc: unknown }> {
  return: KeyToFilter extends this['current'][0]
    ? Modify<this['acc'], this['current'][1]>
    : this['acc'];
}

interface $testR1 extends $<{ current: [string, AnyObject]; acc: unknown[]; tuple: nLengthTuple }> {
  return: TupleIncludes<this['acc'], [this['current'][0], AnyObject]> extends true
    ? this['acc']
    : [...this['acc'], [this['current'][0], TupleReduce<this['tuple'], $testR2<this['current'][0]>, {}>]];
}

type DefaultValue<T, Default> = If<Or<[IsUnknown<T>, IsUndefined<T>]>, {
  then: Default;
  else: T;
}>;

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
  TupleReduce<
  // @ts-ignore
  [
    // @ts-ignore
    ...DefaultValue<T['propsOverwrites'], []>,
    ...DefaultValue<T['statePropsOverwrites'], []>,
    ...DefaultValue<T['dispatchPropsOverwrites'], []>,
  ],
  $testR1,
  []
  >,
  DUnionKey
  >;
};
import { createSlice as createSliceFn } from '@reduxjs/toolkit';
import { connect as connectFn } from 'react-redux';
import { AnyObject } from 'readable-types';
import { FlagsToTest } from 'tests/shared/common';

import { FlagShaper } from '@modules/RootFlagger/infrastructure';

import { OverwriteByFlag } from '@modules/redux/Flagger/app';

const EnabledFeatures: FlagsToTest[] = [FlagsToTest.flagA];

export type Flagger = typeof Flagger;
export const Flagger = new FlagShaper((feature: FlagsToTest) => {
  return EnabledFeatures.includes(feature);
}, {
  keyForOverwrites: 'flagToUse',
  createSliceFn: createSliceFn,
  connectFn: connectFn,
});

export type MyOverwriteByFlag<
  Obj extends AnyObject,
  Over extends [[FlagsToTest, AnyObject], ...[FlagsToTest, AnyObject][]]
> = OverwriteByFlag<Flagger, Obj, Over>;
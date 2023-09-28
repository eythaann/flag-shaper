import { createSlice as createSliceFn } from '@reduxjs/toolkit';
import { connect as connectFn } from 'react-redux';
import { AnyObject } from 'readable-types';
import { FlagsToTest } from '../tests/shared/common';

import { FlagShaper } from 'modules/RootFlagger/infrastructure';

import { OverwriteByFlag } from 'modules/RootFlagger/app';

const EnabledFeatures: FlagsToTest[] = [FlagsToTest.flagA];

export type Shapper = typeof Shapper;
export const Shapper = new FlagShaper((feature: FlagsToTest) => {
  return EnabledFeatures.includes(feature);
}, {
  keyForOverwrites: 'flagToUse',
  createSliceFn: createSliceFn,
  connectFn: connectFn,
});

export type MyOverwriteByFlag<
  Obj extends AnyObject,
  Over extends [[FlagsToTest, AnyObject], ...[FlagsToTest, AnyObject][]]
> = OverwriteByFlag<Shapper, Obj, Over>;
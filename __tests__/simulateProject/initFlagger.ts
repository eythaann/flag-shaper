import { createSlice as createSliceFn } from '@reduxjs/toolkit';
import { connect as connectFn } from 'react-redux';

import { FlagShaper } from '../../src/modules/RootFlagger/infrastructure';

export enum FlagsToTest {
  flagA = 'flagA',
  flagB = 'flagB',
  flagC = 'flagC',
  flagD = 'flagD',
  flagE = 'flagE',
  flagF = 'flagF',
}

const EnabledFeatures: FlagsToTest[] = [FlagsToTest.flagA];
const flagIsEnabled = (feature: FlagsToTest) => {
  return EnabledFeatures.includes(feature);
};

export type Shapper = typeof Shapper;
/* export const Shapper = new FlagShaper((feature: FlagsToTest) => {
  return EnabledFeatures.includes(feature);
}, {
  keyForOverwrites: 'flagToUse',
  createSliceFn: createSliceFn,
  connectFn: connectFn,
}); */

export const Shapper = new FlagShaper.Builder(flagIsEnabled)
  .withJSX()
  .withRedux(connectFn, createSliceFn)
  .build();
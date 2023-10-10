import { createSlice as createSliceFn } from '@reduxjs/toolkit';
import { connect as connectFn } from 'react-redux';
import { AnyObject } from 'readable-types';

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

export type Shapper = typeof Shapper;
export const Shapper = new FlagShaper((feature: FlagsToTest) => {
  return EnabledFeatures.includes(feature);
}, {
  keyForOverwrites: 'flagToUse',
  createSliceFn: createSliceFn,
  connectFn: connectFn,
});
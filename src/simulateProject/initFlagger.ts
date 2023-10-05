import { createSlice as createSliceFn } from '@reduxjs/toolkit';
import { connect as connectFn } from 'react-redux';
import { AnyObject } from 'readable-types';

import { FlagShaper } from '../modules/RootFlagger/infrastructure';

import { CreateFlaggedInterface } from '../modules/RootFlagger/app';

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

export type MyOverwriteByFlag<
  Obj extends AnyObject,
  Over extends [[FlagsToTest, AnyObject], ...[FlagsToTest, AnyObject][]]
> = CreateFlaggedInterface<Obj, Over>;
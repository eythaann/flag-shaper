import { ObjectBuilder } from '../../src/modules/objects/builder/infrastructure';
import { FlagShaperForObjects } from '../../src/modules/objects/infrastructure';

import { DUnionKey, DUnionKeyConnectedDispatch, DUnionKeyConnectedState } from '../../src/modules/shared/domain/constants';
import { IConfig } from '../../src/modules/shared/domain/interfaces';

describe('FlagShaperForObjects', () => {
  let mockValidator;
  let flagShaper;

  beforeEach(() => {
    mockValidator = {};
    flagShaper = new FlagShaperForObjects(mockValidator, {} as IConfig);
  });

  describe('builder', () => {
    it('should return an instance of ObjectBuilder', () => {
      const result = flagShaper.builder();
      expect(result).toBeInstanceOf(ObjectBuilder);
    });
  });

  describe('wasObjectDeclaredWith', () => {
    it('should return false if no flags provided and object does not have any flags', () => {
      const obj = { key: 'value' };
      const result = flagShaper.wasObjectDeclaredWith(obj);
      expect(result).toBe(false);
    });

    it('should return true if no flags provided and object does not have any flags', () => {
      const obj = {};
      const result = flagShaper.wasObjectDeclaredWith(obj, []);
      expect(result).toBe(true);
    });

    it('should return false if flags are provided but object does not have any flags', () => {
      const obj = {};
      const flags = ['featureA'];
      const result = flagShaper.wasObjectDeclaredWith(obj, flags);
      expect(result).toBe(false);
    });

    it('should return true if all provided flags match object flags', () => {
      const obj = {
        [DUnionKey]: ['featureA'],
        [DUnionKeyConnectedState]: ['featureB'],
        [DUnionKeyConnectedDispatch]: ['featureC'],
      };
      const flags = ['featureA', 'featureB', 'featureC'];
      const result = flagShaper.wasObjectDeclaredWith(obj, flags);
      expect(result).toBe(true);
    });

    it('should return false if some provided flags do not match object flags', () => {
      const obj = {
        [DUnionKey]: ['featureA'],
        [DUnionKeyConnectedState]: ['featureB'],
      };
      const flags = ['featureA', 'featureB', 'featureC'];
      const result = flagShaper.wasObjectDeclaredWith(obj, flags);
      expect(result).toBe(false);
    });
  });
});
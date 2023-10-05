import { ObjectBuilder } from '../../../src/modules/objects/builder/infrastructure';

import { DUnionKey, DUnionKeyConnectedDispatch, DUnionKeyConnectedState } from '../../../src/modules/shared/domain/constants';
import { IConfig } from '../../../src/modules/shared/domain/interfaces';

describe('ObjectBuilder', () => {
  let mockValidator;
  let objectBuilder;

  beforeEach(() => {
    mockValidator = {
      isFlagEnabled: jest.fn(),
    };
    objectBuilder = new ObjectBuilder(mockValidator, {} as IConfig);
  });

  describe('addCase', () => {
    it('should add a new case', () => {
      objectBuilder.addCase('featureA', { keyA: 'valueA' });
      expect(objectBuilder.overrides).toEqual([['featureA', { keyA: 'valueA' }]]);
    });
  });

  describe('setObjToOverwrite', () => {
    it('should set the object to overwrite', () => {
      const obj = { key1: 'value1' };
      objectBuilder.setObjToOverwrite(obj);
      expect(objectBuilder._objToApply).toEqual(obj);
    });
  });

  describe('build', () => {
    it('should build the object based on the cases and the flag status', () => {
      const obj = { key1: 'originalValue' };
      objectBuilder.setObjToOverwrite(obj);

      mockValidator.isFlagEnabled.mockReturnValue(true);
      objectBuilder.addCase('featureA', { key1: 'overriddenValue' });

      const result = objectBuilder.build();
      expect(result).toEqual({
        key1: 'overriddenValue',
        [DUnionKey]: ['featureA'],
      });
    });

    it('should not modify the object if the flag is not enabled', () => {
      const obj = { key1: 'originalValue' };
      objectBuilder.setObjToOverwrite(obj);

      mockValidator.isFlagEnabled.mockReturnValue(false);
      objectBuilder.addCase('featureA', { key1: 'overriddenValue' });

      const result = objectBuilder.build();
      expect(result).toEqual({
        key1: 'originalValue',
      });
    });

    it('should build the object based on the cases and the flag status (state)', () => {
      const obj = { key1: 'originalValue' };
      objectBuilder.setObjToOverwrite(obj);

      mockValidator.isFlagEnabled.mockReturnValue(true);
      objectBuilder.addCase('featureA', { key1: 'overriddenValue' });

      const result = objectBuilder.build({ forState: true });
      expect(result).toEqual({
        key1: 'overriddenValue',
        [DUnionKeyConnectedState]: ['featureA'],
      });
    });

    it('should build the object based on the cases and the flag status (dispatch)', () => {
      const obj = { key1: 'originalValue' };
      objectBuilder.setObjToOverwrite(obj);

      mockValidator.isFlagEnabled.mockReturnValue(true);
      objectBuilder.addCase('featureA', { key1: 'overriddenValue' });

      const result = objectBuilder.build({ forDispatch: true });
      expect(result).toEqual({
        key1: 'overriddenValue',
        [DUnionKeyConnectedDispatch]: ['featureA'],
      });
    });
  });
});
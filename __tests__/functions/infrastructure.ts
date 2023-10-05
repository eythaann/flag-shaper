import { FlagShaperForFunctions } from '../../src/modules/functions/infrastructure';

import { IConfig } from '../../src/modules/shared/domain/interfaces';

describe('FlagShaperForFunctions', () => {
  let mockValidator;
  let flagShaper;
  const mockConfig = {} as IConfig;

  beforeEach(() => {
    mockValidator = { allFlagsAreEnabled: jest.fn() };
    flagShaper = new FlagShaperForFunctions(mockValidator, mockConfig);
  });

  describe('executableIn', () => {
    it('should execute provided function if flag is enabled', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockValidator.allFlagsAreEnabled.mockReturnValue(true);

      const executable = flagShaper.executableIn('featureA', mockFn);
      const result = executable('arg1', 'arg2');

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(result).toBe('result');
    });

    it('should not execute provided function if flag is not enabled', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockValidator.allFlagsAreEnabled.mockReturnValue(false);

      const executable = flagShaper.executableIn('featureA', mockFn);
      const result = executable('arg1', 'arg2');

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('callableIn', () => {
    it('should call provided function if flag is enabled', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockValidator.allFlagsAreEnabled.mockReturnValue(true);

      const callable = flagShaper.callableIn('featureA', mockFn);
      const result = callable('arg1', 'arg2');

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(result).toBe('result');
    });

    it('should throw an error if flag is not enabled', () => {
      const mockFn = jest.fn();
      mockFn.mockName('mockFunction');
      mockValidator.allFlagsAreEnabled.mockReturnValue(false);

      const callable = flagShaper.callableIn('featureA', mockFn);

      expect(() => callable('arg1', 'arg2')).toThrowError('mockFunction fn() is not callable if flags are not enabled');
      expect(mockFn).not.toHaveBeenCalled();
    });
  });
});
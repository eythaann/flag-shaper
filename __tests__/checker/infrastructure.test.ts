import { FlagValidator } from '../../src/modules/checker/infrastructure';

describe('FlagValidator', () => {
  let mockIsFlagEnabled: jest.Mock;
  let flagValidator: FlagValidator<string>;

  beforeEach(() => {
    mockIsFlagEnabled = jest.fn();
    flagValidator = new FlagValidator(mockIsFlagEnabled);
  });

  describe('isFlagEnabled', () => {
    it('should return true if flag is enabled', () => {
      mockIsFlagEnabled.mockReturnValue(true);
      expect(flagValidator.isFlagEnabled('featureA')).toBe(true);
    });

    it('should return false if flag is not enabled', () => {
      mockIsFlagEnabled.mockReturnValue(false);
      expect(flagValidator.isFlagEnabled('featureA')).toBe(false);
    });
  });

  describe('someFlagIsEnabled', () => {
    it('should return true if at least one flag is enabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => flag === 'featureA');
      expect(flagValidator.someFlagIsEnabled(['featureA', 'featureB'])).toBe(true);
    });

    it('should return false if none of the flags are enabled', () => {
      mockIsFlagEnabled.mockReturnValue(false);
      expect(flagValidator.someFlagIsEnabled(['featureA', 'featureB'])).toBe(false);
    });
  });

  describe('allFlagsAreEnabled', () => {
    it('should return true if all flags are enabled', () => {
      mockIsFlagEnabled.mockReturnValue(true);
      expect(flagValidator.allFlagsAreEnabled(['featureA', 'featureB'])).toBe(true);
    });

    it('should return false if at least one flag is not enabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => flag !== 'featureB');
      expect(flagValidator.allFlagsAreEnabled(['featureA', 'featureB'])).toBe(false);
    });
  });
});
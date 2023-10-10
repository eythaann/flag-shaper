import { BaseFlagger } from '../../../src/modules/shared/BaseFlagger/app';

class MockFlagValidator {}

class TestFlagger extends BaseFlagger<string, any> {}

describe('BaseFlagger', () => {
  it('should initialize with the provided validator and config', () => {
    const mockValidator = new MockFlagValidator();
    const mockConfig = { someProp: true };

    const flagger = new TestFlagger(mockValidator as any, mockConfig);

    expect((flagger as any).validator).toBe(mockValidator);
    expect((flagger as any).config).toBe(mockConfig);
  });
});
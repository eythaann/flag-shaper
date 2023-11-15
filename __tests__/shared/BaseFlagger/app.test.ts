import { BaseFlagger } from '../../../src/modules/shared/BaseFlagger/app';

class MockFlagValidator {}

class TestFlagger extends BaseFlagger<string> {}

describe('BaseFlagger', () => {
  it('should initialize with the provided validator and config', () => {
    const mockValidator = new MockFlagValidator();
    const flagger = new TestFlagger(mockValidator as any);

    expect((flagger as any).validator).toBe(mockValidator);
  });
});
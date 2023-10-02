export class FlagValidator {
  constructor(isFlagEnabled) {
    this._isFlagEnabled = isFlagEnabled;
  }

  isFlagEnabled(flag) {
    return this._isFlagEnabled(flag);
  }

  someFlagIsEnabled(flag) {
    return [flag].flat().some((currentFlag) => this._isFlagEnabled(currentFlag));
  }

  allFlagsAreEnabled(flag) {
    return [flag].flat().every((currentFlag) => this._isFlagEnabled(currentFlag));
  }
}
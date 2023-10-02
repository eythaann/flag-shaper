export class BaseFlagger {
  constructor(validator, config) {
    this.validator = validator;
    this.config = config;
  }
}
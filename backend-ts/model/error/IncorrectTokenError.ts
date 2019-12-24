import { BaseError } from './BaseError';

export class IncorrectTokenError extends BaseError {
  constructor() {
    super('Your token is incorrect', 403, IncorrectTokenError.name);
  }
}

import { BaseError } from './BaseError';

export class IncorrectBodyError extends BaseError {
  constructor(message) {
    super(message, 400, IncorrectBodyError.name);
  }
}

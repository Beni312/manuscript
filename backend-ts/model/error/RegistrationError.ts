import { BaseError } from "./BaseError";

export class RegistrationError extends BaseError {
  constructor(errorString: string) {
    super(errorString, 103, RegistrationError.name);
  }
}

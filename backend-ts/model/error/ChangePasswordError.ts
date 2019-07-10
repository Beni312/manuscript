import { BaseError } from "./BaseError";

export class ChangePasswordError extends BaseError {
  constructor(errorString: string) {
    super(errorString, 400, ChangePasswordError.name);
  }
}

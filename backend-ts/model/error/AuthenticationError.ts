import { BaseError } from "./BaseError";

export class AuthenticationError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 100, AuthenticationError.name);
    }
}

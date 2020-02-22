import { BaseError } from "./BaseError";

export class AuthenticationError extends BaseError {
    constructor(message = 'Access denied, you must log in!') {
        super(message, 401, AuthenticationError.name);
    }
}

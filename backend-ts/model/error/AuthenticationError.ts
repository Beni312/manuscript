import { BaseError } from "./BaseError";

export class AuthenticationError extends BaseError {
    constructor() {
        super('Access denied, you must log in!', 401, AuthenticationError.name);
    }
}

import {AuthError} from "./AuthError";
import {InternalServerError} from "./InternalServerError";
import { logger } from "./logger";

export function errorHandler(error, req, res, next) {
    if (error instanceof AuthError) {
        logger.error(error);
        return res.status(401).json(error);
    }
    if (error.name === 'AuthenticationError') {
        logger.error(error.message);
        return res.status(403).json(error);
    }
    logger.error(error.message);
    return res.status(500).json(new InternalServerError(error.message));

}

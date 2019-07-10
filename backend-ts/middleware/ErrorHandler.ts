import { InternalServerError } from "../model/error/InternalServerError";
import { logger } from "../service/logger";
import { BaseError } from '../model/error/BaseError';

export const errorHandler = (error: Error, req, res, next) => {
  logger.error(error.name + ' ' + error.message + ' ' + error.stack);
  if (error instanceof BaseError) {
    return res.status(error.status).json(error.message);
  }

  return res.status(500).json(new InternalServerError(error.message));
};

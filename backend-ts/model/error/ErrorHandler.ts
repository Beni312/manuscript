import { AuthenticationError } from "./AuthenticationError";
import { InternalServerError } from "./InternalServerError";
import { logger } from "../../service/logger";

export function errorHandler(error: Error, req, res, next) {
  if (error instanceof AuthenticationError) {
    logger.error(error);
    return res.status(401).json(error);
  }

  if (error.name === "RegistrationError") {
    console.log(error.name);
    return res.status(403).json(error);
  }


  if (error.name === 'ChangePasswordError') {
    logger.error(error.message);
    return res.status(403).json(error);
  }

  if (error.name === 'AuthenticationError') {
    logger.error(error.message);
    return res.status(403).json(error);
  }
  logger.error(error.stack);
  return res.status(500).json(new InternalServerError(error.message));

}

import * as jwt from 'jsonwebtoken';
import { logger } from "../service/logger";
import { AuthenticationError } from "../model/error/AuthenticationError";
import { IncorrectTokenError } from "../model/error/IncorrectTokenError";
import { Socket } from "socket.io";

export const Authorize = ( socket: Socket, next: ( err?: any ) => void ) => {
  if (!socket.handshake.query.token) {
    return next(new AuthenticationError());
  }
  try {
    socket.request.user = jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET).data;
  } catch(err) {
    logger.info('Socket authentication error');
    return next(new IncorrectTokenError());
  }

  next();
};

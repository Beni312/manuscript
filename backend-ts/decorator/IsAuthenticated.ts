import { Handler } from 'express';
import { AuthenticationError } from '../model/error/AuthenticationError';
import { PermissionError } from '../model/error/PermissionError';
import { Principal } from '../model/Principal';

export function isAuthenticated (...roles: string[]): any {
  return function (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>) {
    const fn = descriptor.value as Handler;
    descriptor.value = async function (...args) {
      console.log('decorator');
      let req;
      let nextFunction;
      let principal: Principal | null = null;
      for (const a of args) {
        if (typeof a === 'object') {
          if (a.constructor.name === 'Principal') {
            principal = a;
          } else if (a.constructor.name === 'IncomingMessage') {
            req = a;
          }
        } else if (a.name === 'next') {
          nextFunction = a;
        }
      }

      if (!principal || !principal.details) {
        principal = Reflect.getMetadata('inversify-express-utils:httpcontext', req).user;
        console.log(principal);
        if (!principal || !principal.details) {
          return nextFunction(new AuthenticationError());
        }

        principal.isAuthenticated().then((isAuth => {
          if (!isAuth) {
            return nextFunction(new AuthenticationError());
          }
        }));
      }

      if (roles.length > 0 && !principal.hasRole(roles)) {
        return nextFunction(new PermissionError());
      }

      return fn.call(this, ...args);
    };

    return descriptor;
  };
}

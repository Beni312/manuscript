import { plainToClassFromExist } from 'class-transformer';
import { validate } from 'class-validator';
import { Handler } from 'express';
import { IncorrectBodyError } from '../model/error/IncorrectBodyError';

export const validateBody = (type: { new (): any }) => (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>): any => {
  const method = descriptor.value as Handler;
  descriptor.value = async function(...args: any[]): Promise<any> {
    const typeObject = new type();
    const request = getParam(args, 'IncomingMessage');
    const next = getParam(args, 'next');
    const body = request.body;

    plainToClassFromExist(typeObject, body);

    const errors = await validate(typeObject);
    if (errors.length > 0) {
      return next(new IncorrectBodyError(errors.toString()));
    }

    return method.call(this, ...args);

  };

  return descriptor;
};

const getParam = (args: any[], param: string) => {
  for (const a of args) {
    if (a.constructor.name === param || a.name === param) {
      return a;
    }
  }
};

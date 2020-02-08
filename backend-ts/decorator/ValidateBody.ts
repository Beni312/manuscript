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
    Object.keys(request.body).forEach(k => {
      if (typeof request.body[k] == 'object' && !Array.isArray(request.body[k])) {
        createNestedObject(body, k, typeObject);
      } else {
        typeObject[k] = request.body[k];
      }
    });

    const errors = await validate(typeObject);
    if (errors.length > 0) {
      return next(new IncorrectBodyError(errors.toString()));
    }

    // const requestParameters: RequestParameter[] = Reflect.getOwnMetadata(requestMetadataKey, target, propertyName);
    // if (requestParameters && requestParameters.length > 0) {
    //   for (const requestParameter of requestParameters) {
    //     const requestBody = new requestParameter.request(args[requestParameter.index]);
    //     await requestBody.validate();
    //   }
    // }
    // return method && method.apply(this, args);

    return method.call(this, ...args);

  };

  return descriptor;
};

// const createObject = (body: any, typedObject: any) => {
//
//   Object.keys(body).forEach((k) => {
//     if (Object.keys(body[k]).length > 0) {
//
//     }
//   })
//
// };

// TODO create nested object with arrays to validate request body
const createNestedObject = (body: any, property: string, typedObject: any) => {
  Object.keys(body[property]).forEach(k => {
    typedObject[property][k] = body[property][k];
  });
};

const getParam = (args: any[], param: string) => {
  for (const a of args) {
    if (a.constructor.name === param || a.name === param) {
      return a;
    }
  }
};

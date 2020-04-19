import * as path from 'path';
import { injectable } from 'inversify';

@injectable()
export class UtilsService {

  public groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

  getExtension(filename) {
    const ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
  }
}

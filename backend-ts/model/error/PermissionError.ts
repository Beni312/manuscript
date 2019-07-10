// 'Access Denied - You don\'t have permission to: '
import { BaseError } from './BaseError';

export class PermissionError extends BaseError {
  constructor() {
    super('Access Denied - You don\'t have permission to this action!', 403, PermissionError.name);
  }
}

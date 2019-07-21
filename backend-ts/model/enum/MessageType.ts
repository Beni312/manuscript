import { EnumDataTypeOptions } from 'sequelize';

export enum MessageType {
  INFO='INFO',
  ERROR='ERROR',
  WARNING='WARNING'
}

export class MessageTypeEnumerator implements EnumDataTypeOptions<string> {
  values: string[] = messageTypes;
}

export const messageTypes = Object.keys(MessageType);

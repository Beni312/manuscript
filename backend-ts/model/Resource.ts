import { Model } from 'sequelize-typescript';

export class Resource<T> {
  table: { new (): T } & typeof Model;
  column: string;
  value: any;

  constructor(table: { new (): T } & typeof Model, column: string, value: any) {
    this.table = table;
    this.column = column;
    this.value = value;
  }
}

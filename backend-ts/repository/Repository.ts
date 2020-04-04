import { FindOptions } from 'sequelize';
import { injectable, unmanaged } from 'inversify';
import { InternalServerError } from '../model/error/InternalServerError';
import { Model } from 'sequelize-typescript';
import { NotFoundError } from '../model/error/NotFoundError';

@injectable()
export abstract class Repository<T extends Model> {

  protected model: { new (): T } & typeof Model;

  private NOT_FOUND_ERROR_MESSAGE: string = "TABLE_NAME not found.";
  private PROPERTY_NOT_FOUND_ERROR_MESSAGE: string = "PROPERTY_KEY property not found in TABLE_NAME.";
  private NO_RECORDS_FOUND: string = "No records found in TABLE_NAME table.";

  protected constructor(@unmanaged() model: { new (): T } & typeof Model) {
    this.model = model;
  }

  async _findByPk(id: number | string, options: any = {}): Promise<T> {
    const row: Model<T> | null = await this.model.findByPk(id, options);
    if (!row) {
      throw new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE.replace('TABLE_NAME', this.model.getTableName().toString()));
    }

    return row as T;
  }

  async findAll(options: FindOptions = {}): Promise<T[]> {
    return this.model.findAll<T>(options);
  }

  async _findAll(options: FindOptions = {}): Promise<T[]> {
    const rows: any = await this.model.findAll(options);
    if (rows == null || rows.length == 0) {
      throw new NotFoundError(this.NO_RECORDS_FOUND
        .replace('TABLE_NAME', this.model.getTableName().toString())
      );
    }

    return rows as T[];
  }

  async _findOne(options: FindOptions = {}): Promise<T> {
    const row: Model<T> | null = await this.model.findOne(options);
    if (!row) {
      throw new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE
        .replace('TABLE_NAME', this.model.getTableName().toString())
      );
    }

    return row as T;
  }

  async updateByPk(id: number | string, data: Partial<T>): Promise<T> {
    const row = await this.model.findByPk(id);
    if (!row) {
      throw new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE
        .replace('TABLE_NAME', this.model.getTableName().toString())
      );
    }

    const keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
      if (row[keys[i]] == undefined) {
        throw new InternalServerError(this.PROPERTY_NOT_FOUND_ERROR_MESSAGE
          .replace('TABLE_NAME', this.model.getTableName().toString())
          .replace('PROPERTY_KEY', keys[i])
        );
      }
      row[keys[i]] = data[keys[i]];
    }

    await row.save();

    return row as T;
  }

  async deleteByPk<T extends Model<T>>(id: number | string): Promise<void> {
    const rowToDelete: Model<T> | null = await this.model.findByPk(id);
    if (rowToDelete) {
      return rowToDelete.destroy();
    } else {
      throw new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE
        .replace('TABLE_NAME', this.model.getTableName().toString())
      );
    }
  }

  async deleteByOptions<T extends Model<T>>(options: FindOptions = {}): Promise<void> {
    const rowToDelete = await this.model.findOne(options);

    if (rowToDelete) {
      return rowToDelete.destroy();
    } else {
      throw new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE
        .replace('TABLE_NAME', this.model.getTableName().toString())
      );
    }
  }

  async create(values): Promise<T> {
    return this.model.create<T>(values);
  }

}

import { IFindOptions, Model, Table } from "sequelize-typescript";
import { InternalServerError } from "./error/InternalServerError";
import { logger } from "../service/logger";
import { NotFoundError } from "./error/NotFoundError";

@Table
export class ModelRepository<T extends Model<T>> extends Model<T> {

  // NOT_FOUND_ERROR_MESSAGE: string = "";
  // PROPERTY_NOT_FOUND_ERROR_MESSAGE: string = "";

  static async _findByPk<T extends Model<T>>(id: number | string, options: any = {}, errorMessage: string = this.name + " not found"): Promise<T> {
    const row: Model<T> | null = await this.findByPk<Model<T>>(id, options);
    if (!row) {
      logger.error(errorMessage);
      throw new NotFoundError(errorMessage);
    }

    return row.get();
  }

  static async _findAll<T extends Model<T>>(options: IFindOptions<T> = {}, errorMessage: string = this.name + " not found"): Promise<T[]> {
    // const rows: Model<T>[] = await this.findAll<Model<T>>(options);
    const rows: any = await this.findAll<Model<T>>(options);
    if (rows == null || rows.length == 0) {
      logger.error(errorMessage);
      throw new NotFoundError(errorMessage);
    }

    return rows;
  }

  static async _findOne<T extends Model<T>>(options: IFindOptions<T>, errorMessage: string = this.name + " not found"): Promise<T> {
    const row: Model<T> | null = await this.findOne<Model<T>>(options);
    if (!row) {
      logger.error(errorMessage);
      throw new NotFoundError(errorMessage);
    }
    return row.get();
  }

  static async _deleteByPk<T extends Model<T>>(id: number | string, errorMessage: string = this.name + " not found"): Promise<void> {
    const rowToDelete: Model<T> | null = await this.findByPk<Model<T>>(id);
    if (rowToDelete) {
      return await rowToDelete.destroy();
    } else {
      logger.error(errorMessage);
      throw new NotFoundError(errorMessage);
    }
  }

  static async _deleteByOptions<T extends Model<T>>(options: IFindOptions<T> = {}, errorMessage: string = this.name + " not found"): Promise<void> {
    const rowToDelete = await this.findOne<Model<T>>(options);

    if (rowToDelete) {
      return await rowToDelete.destroy();
    } else {
      logger.error(errorMessage);
      throw new NotFoundError(errorMessage);
    }
  }

  static async _updateByPk<T extends Model<T>>(id: number | string, data: any, errorMessage: string = this.name + " not found"): Promise<Model<T>> {
    const row = await this.findByPk<Model<T>>(id);
    if (!row) {
      throw new NotFoundError(errorMessage);
    }
    Object.keys(data).forEach(key => {
      if (!row[key]) {
        throw new InternalServerError(key + " property not found in " + this.name);
      }
      row[key] = data[key];
    });
    return await row.save();
  }
}

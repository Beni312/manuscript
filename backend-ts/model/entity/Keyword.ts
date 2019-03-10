import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Submission } from "./Submission";

@Table
export class Keyword extends Model<Keyword> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Submission)
  @Column(DataType.INTEGER)
  submissionId: number;

  @Column(DataType.STRING)
  keyword: string;
}

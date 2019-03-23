import { AutoIncrement, Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";
import { Submission } from "./Submission";

@Table
export class Keyword extends ModelRepository<Keyword> {

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

import { Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { ModelRepository } from "../ModelRepository";
import { Submission } from "./Submission";
import { User } from "./User";

@Table
export class AuthorsSubmission extends ModelRepository<AuthorsSubmission> {

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  authorId: number;

  @ForeignKey(() => Submission)
  @Column(DataType.STRING)
  submissionId: string;
}

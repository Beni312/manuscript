import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Submission } from "./Submission";
import { User } from "./User";

@Table
export class AuthorsSubmission extends Model<AuthorsSubmission> {

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  authorId: number;

  @ForeignKey(() => Submission)
  @Column(DataType.STRING)
  submissionId: string;
}

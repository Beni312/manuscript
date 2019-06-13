import { AcademicDiscipline } from './AcademicDiscipline';
import { AuthorsAcademicDiscipline } from './AuthorsAcademicDiscipline';
import { BaseModel } from './BaseModel';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Table } from 'sequelize-typescript';
import { HasManySetAssociationsMixin } from 'sequelize';
import { Password } from './Password';
import { Role } from './Role';
import { UserAlias } from './UserAlias';
import { UserStatus } from './UserStatus';

@Table
export class User extends BaseModel<User> {

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  job: string;

  @Column(DataType.STRING)
  birthDate: string;

  @ForeignKey(() => UserStatus)
  @Column(DataType.INTEGER)
  statusId: number;

  @BelongsTo(() => UserStatus)
  status: UserStatus;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsToMany(() => AcademicDiscipline, () => AuthorsAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];

  @HasOne(() => UserAlias)
  userAlias: UserAlias;

  @HasOne(() => Password)
  password: Password;

  public setAcademicDisciplines!: HasManySetAssociationsMixin<AcademicDiscipline, number>;
}

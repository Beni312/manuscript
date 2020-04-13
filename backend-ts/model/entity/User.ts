import { AcademicDiscipline } from './AcademicDiscipline';
import { AuthorsAcademicDiscipline } from './AuthorsAcademicDiscipline';
import { BaseModel } from './BaseModel';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Table } from 'sequelize-typescript';
import { HasManySetAssociationsMixin } from 'sequelize';
import { Password } from './Password';
import { Role } from './Role';
import { UserAlias } from './UserAlias';
import { UserStatus } from './UserStatus';

@Table({
  modelName: 'user'
})
export class User extends BaseModel<User> {

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  title: string;

  @Column({
    type: DataType.STRING,
    field: 'first_name'
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    field: 'last_name'
  })
  lastName: string;

  @Column(DataType.STRING)
  job: string;

  @Column({
    type: DataType.DATE,
    field: 'birth_date'
  })
  birthDate: Date;

  @Column(DataType.BOOLEAN)
  avatar: boolean;

  @ForeignKey(() => UserStatus)
  @Column({
    type: DataType.INTEGER,
    field: 'status_id'
  })
  statusId: number;

  @BelongsTo(() => UserStatus)
  status: UserStatus;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    field: 'role_id'
  })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsToMany(() => AcademicDiscipline, () => AuthorsAcademicDiscipline)
  academicDisciplines: AcademicDiscipline[];

  @HasOne(() => UserAlias)
  userAlias: UserAlias;

  @HasOne(() => Password)
  password: Password;

  public setAcademicDisciplines!: HasManySetAssociationsMixin<AcademicDiscipline[], number>;
}

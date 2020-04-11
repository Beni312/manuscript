import { IsEmail, IsString, Length } from 'class-validator';

export class AddUserCommand {
  @IsString()
  @Length(3, 30)
  username: string;
  @IsString()
  @Length(8, 50)
  password: string;
  @IsString()
  @Length(8, 50)
  passwordAgain: string;
  @IsString()
  @Length(0, 5)
  title: string;
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  job: string;
  academicDisciplines: number[];
}

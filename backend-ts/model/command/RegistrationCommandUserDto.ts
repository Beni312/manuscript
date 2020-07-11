import { IsEmail, Length } from 'class-validator';

export class RegistrationCommandUserDto {
  @Length(0, 50)
  title: string;
  @Length(2, 50)
  firstName: string;
  @Length(2, 50)
  lastName: string;
  @Length(4, 20)
  username: string;
  @Length(3, 50)
  job: string;
  @IsEmail()
  email: string;
}

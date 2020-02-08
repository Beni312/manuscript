import { IsEmail, Length } from 'class-validator';

export class SavePersonalDataCommand {
  title: string;
  @Length(2, 40)
  firstName: string;
  @Length(2, 40)
  lastName: string;
  @Length(5, 40)
  job: string;
  @IsEmail()
  email: string;
}

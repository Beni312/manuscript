import { Length } from 'class-validator';

export class PasswordDto {
  @Length(6, 200)
  password: string;
  @Length(6, 200)
  passwordAgain: string;
}

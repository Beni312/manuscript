import { IsNumber, IsPositive, IsString } from 'class-validator';

export class AdminChangePasswordCommand {
  @IsNumber()
  @IsPositive()
  userId: number;
  @IsString()
  password: string;
  @IsString()
  passwordAgain: string;
}

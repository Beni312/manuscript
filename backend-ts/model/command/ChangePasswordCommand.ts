import { IsNumber, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PasswordDto } from '../dto/PasswordDto';

export class ChangePasswordCommand {
  @IsNumber()
  userId: number;
  @ValidateNested({ each: true })
  @Type(() => PasswordDto)
  password: PasswordDto;
  @Length(4, 200)
  oldPassword: string;

}

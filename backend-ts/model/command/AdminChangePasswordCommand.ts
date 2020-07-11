import { IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { PasswordDto } from '../dto/PasswordDto';
import { Type } from 'class-transformer';

export class AdminChangePasswordCommand {
  @IsNumber()
  @IsPositive()
  userId: number;
  @ValidateNested({ each: true })
  @Type(() => PasswordDto)
  password: PasswordDto;
}

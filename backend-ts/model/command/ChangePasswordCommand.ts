import { Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PasswordDto } from '../dto/PasswordDto';

export class ChangePasswordCommand {
  @ValidateNested({ each: true })
  @Type(() => PasswordDto)
  password: PasswordDto;
  @Length(4, 200)
  oldPassword: string;

}

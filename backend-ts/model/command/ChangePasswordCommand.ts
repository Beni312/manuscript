import { PasswordDto } from '../dto/PasswordDto';
import { Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangePasswordCommand {

  @ValidateNested({ each: true })
  @Type(() => PasswordDto)
  password: PasswordDto;
  @Length(4, 200)
  oldPassword: string;

}

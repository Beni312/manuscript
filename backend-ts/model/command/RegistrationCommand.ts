import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { RegistrationCommandUserDto } from './RegistrationCommandUserDto';
import { PasswordDto } from '../dto/PasswordDto';

export class RegistrationCommand {

  @ValidateNested({ each: true })
  @Type(() => RegistrationCommandUserDto)
  user: RegistrationCommandUserDto;
  academicDisciplines: number[];
  @ValidateNested({ each: true })
  @Type(() => PasswordDto)
  password: PasswordDto;

  constructor() {
    this.user = new RegistrationCommandUserDto();
    this.password = new PasswordDto();
  }

}

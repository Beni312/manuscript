import { RegistrationCommandUserDto } from './RegistrationCommandUserDto';
import { PasswordDto } from '../dto/PasswordDto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

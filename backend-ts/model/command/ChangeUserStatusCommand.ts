import { IsNumber, IsPositive } from 'class-validator';

export class ChangeUserStatusCommand {
  @IsNumber()
  @IsPositive()
  userId: number;
  @IsNumber()
  @IsPositive()
  statusId: number;
}

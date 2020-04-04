import { IsNumber, IsPositive, IsString, Length } from "class-validator";

export class SendMessageCommand {
  @IsNumber()
  @IsPositive()
  to: number;
  @IsString()
  @Length(1, 200)
  message: string;
}

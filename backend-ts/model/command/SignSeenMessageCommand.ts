import { IsNumber } from "class-validator";

export class SignSeenMessageCommand {
  @IsNumber()
  to: number;
}

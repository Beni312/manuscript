import { IsNumber, IsPositive } from 'class-validator';

export class DownloadManuscriptCommand {
  @IsNumber()
  @IsPositive()
  manuscriptId: number;
}

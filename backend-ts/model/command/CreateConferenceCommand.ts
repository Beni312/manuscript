import { ArrayMinSize, Length } from 'class-validator';

export class CreateConferenceCommand {
  @Length(5, 50)
  title: string;
  @Length(5, 254)
  description: string;
  @ArrayMinSize(1)
  academicDisciplines: number[];
}

import { IsPositive } from 'class-validator';

export class AcademicDisciplineDto {
  @IsPositive()
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

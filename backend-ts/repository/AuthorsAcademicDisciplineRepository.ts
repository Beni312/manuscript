import { AuthorsAcademicDiscipline } from '../model';
import { injectable } from 'inversify';
import { Repository } from './Repository';

@injectable()
export class AuthorsAcademicDisciplineRepository extends Repository<AuthorsAcademicDiscipline> {

  constructor() {
    super(AuthorsAcademicDiscipline);
  }

}

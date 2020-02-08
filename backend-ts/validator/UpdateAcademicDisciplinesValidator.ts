import * as express from 'express';
import { inject, injectable } from 'inversify';
import { next, request, response } from 'inversify-express-utils';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { AcademicDisciplineRepository } from '../repository/AcademicDisciplineRepository';
import { BaseValidator } from './BaseValidator';
import { IncorrectBodyError } from '../model/error/IncorrectBodyError';

@injectable()
export class UpdateAcademicDisciplinesValidator extends BaseValidator {

  @inject(AcademicDisciplineRepository.name)
  academicDisciplineRepository: AcademicDisciplineRepository;

  handler(@request() req: express.Request, @response() res: express.Response, @next() next: express.NextFunction): void {
    const academicDisciplines: AcademicDisciplineDto[] = req.body;
    this.academicDisciplineRepository.findAcademicDisciplinesByIds(academicDisciplines.map(item => item.id))
      .then(result => {
        if (result.length !== academicDisciplines.length) {
          next(new IncorrectBodyError('Incorrect academic discipline(s). Refresh the page and try again.'));
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log('ad handler error');
        console.log(err);
      });
  }

}

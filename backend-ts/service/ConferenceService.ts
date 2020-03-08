import { inject, injectable } from 'inversify';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { AcademicDisciplineRepository } from '../repository/AcademicDisciplineRepository';
import { AuthorDto } from '../model/dto/AuthorDto';
import { ConferenceRepository } from '../repository/ConferenceRepository';
import { ConferenceDto } from '../model/dto/ConferenceDto';
import { ConferenceSubmissionDto } from '../model/dto/ConferenceSubmissionDto';
import { Submission } from '../model';
import { UserDto } from '../model/dto/UserDto';

@injectable()
export class ConferenceService {

  @inject(AcademicDisciplineRepository.name)
  academicDisciplineRepository: AcademicDisciplineRepository;

  @inject(ConferenceRepository.name)
  conferenceRepository: ConferenceRepository;

  async findConferences(): Promise<ConferenceDto[]> {
    const conferences = await this.conferenceRepository.findConferences();
    return conferences
      .map(c => {
        const uniqueUserSubmissions: Array<Submission> = this.removeDuplicates(c.submissions, 'submitterId');
        return new ConferenceDto(c.title, c.description, new AuthorDto(c.submitter),
          c.submissions.map(s => new ConferenceSubmissionDto(s.id, s.title, s.status, new AuthorDto(s.submitter), s.conferenceId)),
          // c.submissions.map(s => new UserDto(s.submitter))
          uniqueUserSubmissions.map(s => new UserDto(s.submitter)),
          c.academicDisciplines.map(a => new AcademicDisciplineDto(a.id, a.name))
        );
      });
  }

  removeDuplicates(myArr, prop): Array<typeof myArr> {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
}

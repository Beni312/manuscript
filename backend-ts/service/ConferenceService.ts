import { AcademicDisciplineRepository } from '../repository/AcademicDisciplineRepository';
import { AuthorDto } from '../model/dto/AuthorDto';
import { ConferenceRepository } from '../repository/ConferenceRepository';
import { ConferenceDto } from '../model/dto/ConferenceDto';
import { ConferenceSubmissionDto } from '../model/dto/ConferenceSubmissionDto';
import { inject, injectable } from 'inversify';

@injectable()
export class ConferenceService {

  @inject(AcademicDisciplineRepository.name)
  academicDisciplineRepository: AcademicDisciplineRepository;

  @inject(ConferenceRepository.name)
  conferenceRepository: ConferenceRepository;

  async findConferences(): Promise<ConferenceDto[]> {
    // add submissions authors,academic disciplines
    return (await this.conferenceRepository.findConferences())
      .map(c => new ConferenceDto(c.title, c.description, new AuthorDto(c.submitter),
        c.submissions.map(s => new ConferenceSubmissionDto(s.id, s.title, s.status, new AuthorDto(s.submitter), s.conferenceId))));
  }
}

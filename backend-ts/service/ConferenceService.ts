import { inject, injectable } from 'inversify';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { AcademicDisciplineRepository } from '../repository/AcademicDisciplineRepository';
import { AuthorDto } from '../model/dto/AuthorDto';
import { ConferenceRepository } from '../repository/ConferenceRepository';
import { ConferenceDto } from '../model/dto/ConferenceDto';
import { ConferenceSubmissionDto } from '../model/dto/ConferenceSubmissionDto';
import { Conference, Submission } from '../model';
import { CreateConferenceCommand } from '../model/command/CreateConferenceCommand';
import { EditConferenceCommand } from '../model/command/EditConferenceCommand';
import { UserDto } from '../model/dto/UserDto';
import { UserRepository } from '../repository/UserRepository';

@injectable()
export class ConferenceService {

  @inject(AcademicDisciplineRepository.name)
  private academicDisciplineRepository: AcademicDisciplineRepository;

  @inject(ConferenceRepository.name)
  private conferenceRepository: ConferenceRepository;

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  async findConferences(): Promise<ConferenceDto[]> {
    const conferences = await this.conferenceRepository.findConferences();
    return conferences
      .map(c => {
        const uniqueUserSubmissions: Array<Submission> = this.removeDuplicates(c.submissions, 'submitterId');
        return new ConferenceDto(c.title, c.description, new AuthorDto(c.submitter),
          c.submissions.map(s => new ConferenceSubmissionDto(s.id, s.title, s.status, new AuthorDto(s.submitter), s.conferenceId)),
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

  async createConference(userId: number, command: CreateConferenceCommand): Promise<ConferenceDto> {
    const conference = await this.conferenceRepository.createConference(userId, command.title, command.description, command.academicDisciplines);
    const user = await this.userRepository._findByPk(userId);
    return new ConferenceDto(
      conference.title,
      conference.description,
      new AuthorDto(user),
      [],
      new Array(new UserDto(user)),
      conference.academicDisciplines.map(a => new AcademicDisciplineDto(a.id, a.name)));
  }

  async editConference(command: EditConferenceCommand): Promise<Conference> {
    const conference = await this.conferenceRepository.updateByPk(command.conferenceId, {
      title: command.title,
      description: command.description
    });

    await conference.setAcademicDisciplines(command.academicDisciplines);
    await conference.save();
    return conference;
  }
}

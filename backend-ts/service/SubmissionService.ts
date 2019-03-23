import { IFindOptions } from "sequelize-typescript";
import { AcademicDiscipline, Conference, Keyword, Submission, User } from "../model/index";
import { SubmissionPreload } from "../model/dto/SubmissionPreload";

export class SubmissionService {

  public async findUserSubmissions(userId) {
    let options: IFindOptions<Submission> = {
      include: [
        {
          model: User
        }
      ]
    };
    // this.submissionRepository.findSubmissions()
  }

  async preload(userId ,role): Promise<SubmissionPreload> {
    let submissionOptions: any = {
      include: [
        {
          model: AcademicDiscipline,
          attributes: ['id', 'name'],
          through: {attributes: []}
        },
        {
          model: User,
          as: 'authors',
          attributes: ['id', 'email', 'firstName', 'lastName'],
          through: {attributes: []}
        },
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: Keyword
        }
      ]
    };
    let conferenceOptions: any = {attributes: ['id', 'title']};

    if (role !== "ADMIN") {
      let submitter: any = submissionOptions.include[1];
      submitter.through = { attributes: [], where: {authorId: userId}};
    }

    const submissions: Submission[] = await Submission.findAll(submissionOptions);
    const submissionIds: number[] = submissions.map(item => item.id);

    if (role !== "ADMIN") {
      conferenceOptions.include = [{model: Submission, where: {id: submissionIds}}];
    }

    const conferenceIdNamePairs = await Conference.findAll(conferenceOptions);
    return new SubmissionPreload(submissions, conferenceIdNamePairs);
  }

  async remove(submissionId): Promise<void> {
    await Submission._deleteByPk(submissionId);
  }
}

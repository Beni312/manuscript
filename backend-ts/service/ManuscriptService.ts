import * as path from 'path';
import { inject, injectable } from 'inversify';
import { writeFileSync } from 'fs';
import { ManuscriptRepository } from '../repository/ManuscriptRepository';
import { UtilsService } from './UtilsService';

@injectable()
export class ManuscriptService {

  private static MANUSCRIPT_FILENAME_PATTERN: string = 'USERID_SUBMISSIONID_VERSION.EXT';

  @inject(ManuscriptRepository.name)
  manuscriptRepository: ManuscriptRepository;

  @inject(UtilsService.name)
  utilsService: UtilsService;

  public async saveAndCreateManuscript(userId, submissionId, file: Express.Multer.File) {
    let latestManuscriptVersion: number = await this.manuscriptRepository.findLatestVersionForSubmission(submissionId);
    if (!latestManuscriptVersion) {
      latestManuscriptVersion = 1;
    } else {
      latestManuscriptVersion++;
    }
    const filename: string = ManuscriptService.MANUSCRIPT_FILENAME_PATTERN
        .replace('USERID', userId.toString())
        .replace('SUBMISSIONID', submissionId.toString())
        .replace('VERSION', latestManuscriptVersion.toString())
        .replace('EXT', this.utilsService.getExtension(file.originalname));
    const appDir = path.dirname(require.main!.filename);
    writeFileSync(appDir + process.env.MANUSCRIPT_FOLDER + '/' + filename, file.buffer);
    await this.manuscriptRepository.createManuscript(userId, submissionId, filename, latestManuscriptVersion);
  }

  findManuscriptsToSubmission(submissionId: number) {
    return this.manuscriptRepository.findAll({
      where: {
        submissionId: submissionId
      }
    })
  }

}

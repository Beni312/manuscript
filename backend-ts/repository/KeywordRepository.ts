import { injectable } from 'inversify';
import { Keyword } from '../model';
import { Repository } from './Repository';

@injectable()
export class KeywordRepository extends Repository<Keyword> {

  constructor() {
    super(Keyword);
  }

  async deleteKeywordBySubmissionId(submissionId: number, keyword: string): Promise<void> {
    this.deleteByOptions({
      where: {
        submissionId: submissionId,
        keyword: keyword
      }
    });
  }

}

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { controller, httpGet, principal, queryParam, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { logger } from '../service/logger';
import { ManuscriptService } from '../service/ManuscriptService';
import { ManuscriptDto } from '../model/dto/ManuscriptDto';
import { Principal } from '../model/Principal';

@controller('/manuscript')
export class ManuscriptController {

  @inject(ManuscriptService.name)
  private manuscriptService: ManuscriptService;

  @isAuthenticated()
  @httpGet('/')
  findAllApprovedManuscript(@principal() userPrincipal: Principal): Promise<Array<ManuscriptDto>> {
    return this.manuscriptService.findManuscripts();
  }

  @isAuthenticated()
  @httpGet('/download')
  // @validateBody(DownloadManuscriptCommand)
  async downloadManuscript(@request() req: express.Request, @response() res: express.Response, @queryParam('manuscriptId') manuscriptId: string) {
    const filename = await this.manuscriptService.getManuscriptFilenameById(Number(manuscriptId));
    const appDir = path.dirname(require.main!.filename);
    const filePath = path.join(appDir + process.env.MANUSCRIPT_FOLDER, filename);
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'multipart/form-data',
      'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    res.on('error', function(err) {
      logger.error(err);
      readStream.destroy(err);
    });
  }
}

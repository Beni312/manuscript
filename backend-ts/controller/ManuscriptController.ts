import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { controller, httpGet, principal, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { isAuthenticated } from '../decorator/IsAuthenticated';
import { validateBody } from '../decorator/ValidateBody';
import { logger } from '../service/logger';
import { DownloadManuscriptCommand } from '../model/command/DownloadManuscriptCommand';
import { ManuscriptService } from '../service/ManuscriptService';
import { ManuscriptDto } from '../model/dto/ManuscriptDto';
import { Principal } from '../model/Principal';

@controller('/manuscript')
export class ManuscriptController {

  @inject(ManuscriptService.name)
  manuscriptService: ManuscriptService;

  @isAuthenticated()
  @httpGet('/')
  findAllApprovedManuscript(@principal() userPrincipal: Principal): Promise<Array<ManuscriptDto>> {
    return this.manuscriptService.findManuscripts();
  }

  @isAuthenticated()
  @httpGet('/download')
  @validateBody(DownloadManuscriptCommand)
  async downloadManuscript(@request() req: express.Request, @response() res: express.Response) {
    const filename = await this.manuscriptService.getManuscriptFilenameById(req.body.manuscriptId);
    const appDir = path.dirname(require.main!.filename);
    const filePath = path.join(appDir, filename);
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
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

import * as path from 'path';
import * as sharp from 'sharp';
import { injectable } from 'inversify';

@injectable()
export class ImageResizer {

  async resizeAvatar(buffer, filePath) {
    await sharp(buffer)
      .resize(400, 400, {
        fit: sharp.fit.cover,
        withoutEnlargement: true
      })
      .toFile(path.resolve(filePath + '.jpg'));
  }
}

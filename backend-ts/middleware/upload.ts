import * as multer from 'multer';

require('dotenv').config({warnings: true});

// const appDir = path.dirname(require.main!.filename);
// export const upload = multer({ dest: appDir + '/' +  process.env.UPLOAD_PATH});
// console.log(Number(process.env.MANUSCRIPT_MAX_FILE_SIZE));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const appDir = path.dirname(require.main!.filename);
//     console.log(appDir + process.env.MANUSCRIPT_FOLDER);
//     cb(null, appDir + process.env.MANUSCRIPT_FOLDER)
//   },
//   filename: async function (req, file, cb) {
//     const principal: Principal = Reflect.getMetadata('inversify-express-utils:httpcontext', req).user;
//     const filename = await Server.container.get<ManuscriptService>(ManuscriptService.name).getFilename(principal.details.id, req.body.submissionId, file)
//     cb(null, filename)
//   }
// });

// export const upload = multer({storage: storage, limits: {fileSize: Number(process.env.MANUSCRIPT_MAX_FILE_SIZE) * 1024 * 1024}});
export const upload = multer({limits: {fileSize: Number(process.env.MANUSCRIPT_MAX_FILE_SIZE) * 1024 *1024}});

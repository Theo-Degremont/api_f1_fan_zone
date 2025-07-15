import multer from 'multer';
import { FastifyReply, FastifyRequest } from 'fastify';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier pour stocker les fichiers
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

export function uploadMiddleware(fieldName: string) {
  return (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
    upload.single(fieldName)(
      req.raw as any,
      reply.raw as any,
      (err: any) => {
        if (err) {
          reply.status(400).send({ error: err.message });
          return;
        }
        done();
      }
    );
  };
}
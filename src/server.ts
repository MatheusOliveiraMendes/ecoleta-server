import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import routes from './routes';

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(routes);

const DEFAULT_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const hasDefaultUploads = fs.existsSync(DEFAULT_UPLOAD_DIR);
const uploadsDirFromEnv = process.env.UPLOAD_DIR;

let configuredUploadsDir: string | undefined;

if (uploadsDirFromEnv) {
  fs.mkdirSync(uploadsDirFromEnv, { recursive: true });
  configuredUploadsDir = uploadsDirFromEnv;
} else if (hasDefaultUploads) {
  configuredUploadsDir = DEFAULT_UPLOAD_DIR;
}

if (configuredUploadsDir) {
  app.use('/uploads', express.static(configuredUploadsDir));
}

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if (configuredUploadsDir) {
    console.log(`Serving uploads from: ${configuredUploadsDir}`);
  } else {
    console.log('Static uploads directory not configured; /uploads route disabled.');
  }
});

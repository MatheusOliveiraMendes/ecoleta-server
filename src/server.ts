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
const UPLOAD_DIR = process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const copyDefaultUploads = () => {
  if (!fs.existsSync(DEFAULT_UPLOAD_DIR) || DEFAULT_UPLOAD_DIR === UPLOAD_DIR) {
    return;
  }

  const entries = fs.readdirSync(DEFAULT_UPLOAD_DIR, { withFileTypes: true });
  entries.forEach(entry => {
    if (!entry.isFile()) {
      return;
    }

    const sourcePath = path.join(DEFAULT_UPLOAD_DIR, entry.name);
    const targetPath = path.join(UPLOAD_DIR, entry.name);

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
};

copyDefaultUploads();

app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Serving uploads from: ${UPLOAD_DIR}`);
});

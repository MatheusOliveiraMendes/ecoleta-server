import express from 'express';
import cors from 'cors';
import fs from 'fs';
import routes from './routes';

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(routes);

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/var/data/uploads';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Serving uploads from: ${UPLOAD_DIR}`);
});
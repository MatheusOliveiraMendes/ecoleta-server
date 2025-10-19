import express from 'express';
import cors from 'cors'; 
import path from 'path';
import routes from './routes';

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

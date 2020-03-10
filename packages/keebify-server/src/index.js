import path from 'path';
import express from 'express';
import ENV from './env';

const DIR = path.join(__dirname, '../../client/build');
const app = express();

app.use(express.static(DIR));
app.get('/', (req, res) => res.sendFile(path.join(DIR, 'index.html')));
app.listen(ENV.SERVER_PORT);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter, devDatabaseUrl } = require('./utils/config');
const router = require('./routes/routes');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NODE_ENV, DATABASE_URL, PORT } = require('./utils/constants');

const app = express();

const corsAllowed = [
  'https://localhost:3001',
  'http://localhost:3001',
  'https://api.kate.diplom.nomoreparties.sbs',
  'http://api.kate.diplom.nomoreparties.sbs',
  'https://kate.diplom.nomoreparties.sbs',
  'http://kate.diplom.nomoreparties.sbs',
];

app.use(requestLogger);
app.use(limiter); // подключаем rate-limiter
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (corsAllowed.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS Error'));
    }
  },
}));
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(helmet()); // настраиваем заголовки
app.use(router);
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // мидлвара централизованного обработчика ошибок

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : devDatabaseUrl);
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Запущен на https://localhost:${PORT}`));

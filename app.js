const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { urlValidator } = require('./utils/urlValidator');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(urlValidator),
    }),
  }),
  createUser,
);
app.use(auth);

app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errors());
app.use(errorHandler);

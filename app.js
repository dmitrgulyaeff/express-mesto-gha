const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res, next) => {
  req.user = {
    _id: '647cc1c529bc4fef151c6d65',
  };

  next();
});

app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errorHandler);

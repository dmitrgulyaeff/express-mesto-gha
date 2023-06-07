const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errorHandler);

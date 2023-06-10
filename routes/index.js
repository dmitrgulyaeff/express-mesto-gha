const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { urlValidator } = require('../utils/urlValidator');
const NotFoundError = require('../errors/not-found');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
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
router.use(auth);
router.post('/signout', logout);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Не найдено'));
});

module.exports = router;

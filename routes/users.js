const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../utils/urlValidator');
const {
  getUsers,
  getUser,
  getUserByIdFromAuth,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserByIdFromAuth);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2).custom(urlValidator),
    }),
  }),
  updateAvatar,
);

module.exports = router;

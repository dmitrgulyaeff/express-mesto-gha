const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../utils/urlValidator');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const validationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
};

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidator),
  }),
}), createCard);

router.delete('/:cardId', celebrate(validationConfig), deleteCard);
router.put('/:cardId/likes', celebrate(validationConfig), likeCard);
router.delete('/:cardId/likes', celebrate(validationConfig), dislikeCard);

module.exports = router;

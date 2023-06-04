const Cards = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');

const getCards = async (req, res, next) => {
  try {
    const cards = await Cards.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Cards.create({ name, link, owner });
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        ),
      );
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Cards.findByIdAndRemove(cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError('Переданы некорректные данные для постановки лайка'),
      );
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError('Переданы некорректные данные для снятия лайка'),
      );
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

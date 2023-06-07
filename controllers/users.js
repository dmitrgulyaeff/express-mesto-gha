const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
    } else {
      next(err);
    }
  }
};

const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ),
      );
    } else {
      next(err);
    }
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля',
        ),
      );
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля',
        ),
      );
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};

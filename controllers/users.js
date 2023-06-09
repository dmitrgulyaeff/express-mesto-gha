const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    }).send({ token });
  } catch (err) {
    next(err);
  }
};

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

const getUserByIdFromAuth = async (req, res, next) => {
  try {
    const userId = req.user._id;
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
    const { password: userPassword, ...userWithoutPassword } = user.toObject();
    res.status(201).send({ ...userWithoutPassword });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ),
      );
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Пользователь с таким логином уже существует'));
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

const logout = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }).send({ message: 'Вы вышли из профиля' });
};

module.exports = {
  login,
  getUsers,
  getUser,
  getUserByIdFromAuth,
  createUser,
  updateProfile,
  updateAvatar,
  logout,
};

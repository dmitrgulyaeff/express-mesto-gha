// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // отправка сообщения об ошибке
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = errorHandler;

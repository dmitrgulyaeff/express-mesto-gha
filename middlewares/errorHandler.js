const errorHandler = (err, req, res, next) => {
  if (err) {
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
  } else {
    // передача управления следующему middleware или route handler
    next();
  }
};

module.exports = errorHandler;

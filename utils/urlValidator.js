module.exports.urlValidator = (string) => {
  const regex = /https?:\/\/(www)?[0-9a-z-]{1,63}(\.|\/)[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?/i;
  if (regex.test(string)) {
    return string;
  }
  throw new Error('Введен некорректный url');
};

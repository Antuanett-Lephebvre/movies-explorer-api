const allowedCors = [
  'http://api.kate.diplom.nomoreparties.sbs/',
  'https://api.kate.diplom.nomoreparties.sbs/',
  'http://kate.diplom.nomoreparties.sbs/',
  'https://kate.diplom.nomoreparties.sbs/',
  'http://localhost:3000',
  'https://localhost:3000',
];

module.exports = (req, res, next) => {
  try {
    const { origin } = req.headers;
    const { method } = req;
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const requestHeaders = req.headers['access-control-request-headers'];
    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', true);
    }
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.end();
    }
    next();
  } catch (err) {
    next(err);
  }
};

import jwt from 'jsonwebtoken';
import { getToken } from '../utils/index.js';

const checkToken = (req, res, next) => {
  const requestUrl = req.url.toLowerCase();
  if (
    requestUrl === '/favicon.ico' ||
    requestUrl === '/' ||
    requestUrl === '/user/login' ||
    requestUrl === '/market/listed' ||
    requestUrl === '/market/mint'
  ) {
    next();
    return;
  }

  const token = getToken(req);
  try {
    const jwtObject = jwt.verify(token, process.env.JWT_KEY);

    const isExpired = Date.now() >= jwtObject.exp * 1000;

    if (isExpired) {
      res.status(400).json({
        message: 'Token is expired',
      });
      res.end();
    } else {
      next();
    }
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};

export default checkToken;

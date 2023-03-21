const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../helpers/errors");

const authMiddleware = (req, res, next) => {
  try {
    // TODO: validate token type later
    const { authorization } = req.headers;
    if (!authorization) {
      next(
        new NotAuthorizedError(
          "Please, provide a token in request authorization header"
        )
      );
    }
    // bearer, token
    const [, token] = authorization.split(" ");

    if (!token) {
      next(new NotAuthorizedError("Please, provide a token"));
    }
    const SECRET_JVT = process.env.JWT_SECRET_KEY;
    const user = jwt.decode(token, SECRET_JVT);

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    next(new NotAuthorizedError("Invalid token"));
  }
};

module.exports = {
  authMiddleware,
};

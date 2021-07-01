import jwt from 'jsonwebtoken';

export const generateToken = (user, secret, expiresIn) => {
  const { id, name, email } = user;

  return jwt.sign({ id, name, email }, secret, { expiresIn });
};

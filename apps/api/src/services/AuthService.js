import jwt from 'jsonwebtoken';
import { E } from '../utils/appError.js';
import { accountRepo } from '../repositories/accountRepo.js';

export const AuthService = {
  login({ userId }) {
    const acc = accountRepo.findById(userId);
    if (!acc) throw E.unauthorized('INVALID_CREDENTIALS', 'Invalid user ID');
    const token = jwt.sign({ sub: acc.id, role: acc.role }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    return { token, me: acc };
  },
};

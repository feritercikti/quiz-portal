import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DataStoredInToken {
  token: string | JwtPayload;
  userId: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decodedToken = jwt.verify(
      token!,
      process.env.JWT_SECRET!
    ) as DataStoredInToken;
    const userId = decodedToken.userId;
    req.body.userId = userId;
    next();
  } catch (error) {
    res.status(401).send({
      message: 'You are not authenticated',
      data: error,
      success: false,
    });
  }
};

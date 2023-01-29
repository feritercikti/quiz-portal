import express, { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

//user registration

router.post('/register', async (req: Request, res: Response) => {
  try {
    const userExists = await UserModel.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: 'User already exists', success: false });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //create new user
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.send({ message: 'User created successfully', success: true });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
});

//user login

router.post('/login', async (req: Request, res: Response) => {
  try {
    //check if user exists
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: 'User does not exist', success: false });
    }

    //check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(200)
        .send({ mesage: 'Invalid password', success: false });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '30d',
    });

    res.send({
      message: 'user logged in successfully',
      success: true,
      data: token,
    });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
});

//get user info

router.post('/get-user-info', auth, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    res.send({
      message: 'User info fetched successfully',
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

export default router;

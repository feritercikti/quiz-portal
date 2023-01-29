import { auth } from '../middleware/authMiddleware';
import { ExamModel } from '../models/common';
import { UserModel } from '../models/userModel';
import { ReportModel } from '../models/common';
import express, { Request, Response } from 'express';

const router = express.Router();

//add report

router.post('/add-report', auth, async (req: Request, res: Response) => {
  try {
    const newReport = new ReportModel(req.body);
    await newReport.save();
    res.send({
      message: 'Report added successfully',
      success: true,
    });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
});

//get all reports
router.post('/get-all-reports', auth, async (req: Request, res: Response) => {
  try {
    const { examName, userName } = req.body;
    const exams = await ExamModel.find({
      name: {
        $regex: examName,
      },
    });

    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await UserModel.find({
      name: {
        $regex: userName,
      },
    });

    const matchedUserIds = users.map((user) => user._id);

    const reports = await ReportModel.find({
      exam: {
        $in: matchedExamIds,
      },
      user: {
        $in: matchedUserIds,
      },
    })
      .populate('exam')
      .populate('user')
      .sort({ createdAt: -1 });
    res.send({
      message: 'Attempts fetched successfully',
      data: reports,
      success: true,
    });
  } catch (error: any) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

//get all reports by user
router.post(
  '/get-all-reports-by-user',
  auth,
  async (req: Request, res: Response) => {
    try {
      const reports = await ReportModel.find({ user: req.body.userId })
        .populate('exam')
        .populate('user')
        .sort({ createdAt: -1 });
      res.send({
        message: 'Attempts fetched successfully',
        data: reports,
        success: true,
      });
    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  }
);

export default router;

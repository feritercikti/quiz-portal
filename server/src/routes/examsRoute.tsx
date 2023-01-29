import { auth } from '../middleware/authMiddleware';
import { ExamModel } from '../models/common';
import { QuestionsModel } from '../models/common';
import express, { Request, Response } from 'express';

const router = express.Router();

//add exam

router.post('/add', auth, async (req: Request, res: Response) => {
  try {
    //check if the exam already exists
    const examExists = await ExamModel.findOne({ name: req.body.name });
    if (examExists) {
      return res
        .status(200)
        .send({ message: 'Exam already exists', success: false });
    }
    req.body.questions = [];
    const newExam = new ExamModel(req.body);
    await newExam.save();
    res.send({
      message: 'Exam added successfully',
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

//get all exams
router.get('/get-all-exams', async (req: Request, res: Response) => {
  try {
    const exams = await ExamModel.find({});
    res.send({
      message: 'Exams fetched successfully',
      data: exams,
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

//get exam by id
router.post('/get-exam-by-id', auth, async (req: Request, res: Response) => {
  try {
    const exam = await ExamModel.findById(req.body.examId).populate(
      'questions'
    );
    res.send({
      message: 'Exam fetched successfully',
      data: exam,
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

// edit exam by id
router.post('/edit-exam-by-id', auth, async (req, res) => {
  try {
    await ExamModel.findByIdAndUpdate(req.body.examId, req.body);
    res.send({
      message: 'Exam edited successfully',
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

// delete exam by id
router.delete('/delete-exam-by-id', auth, async (req, res) => {
  try {
    await ExamModel.findByIdAndDelete(req.body.examId);
    res.send({
      message: 'Exam deleted successfully',
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

//add question to exam

router.post(
  '/add-question-to-exam',
  auth,
  async (req: Request, res: Response) => {
    try {
      //add question to Questions collection
      const newQuestion = new QuestionsModel(req.body);
      const question = await newQuestion.save();

      //add question to exam
      const exam = await ExamModel.findById(req.body.exam);
      exam?.questions.push(question._id);
      await exam?.save();
      res.send({
        message: 'Question added successfully',
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

//edit question in exam
router.post(
  '/edit-question-in-exam',
  auth,
  async (req: Request, res: Response) => {
    try {
      //edit question in Questions collection
      await QuestionsModel.findByIdAndUpdate(req.body.questionId, req.body);
      res.send({
        message: 'Question edited successfully',
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

router.post(
  '/delete-question-in-exam',
  auth,
  async (req: Request, res: Response) => {
    try {
      //delete question in Questions collection
      await QuestionsModel.findByIdAndUpdate(req.body.questionId);

      //delete question in exam
      const exam = await ExamModel.findById(req.body.examId);

      if (exam != undefined) {
        exam.questions = exam?.questions.filter(
          (question) => question._id != req.body.questionId
        );
      }

      await exam?.save();
      res.send({
        message: 'Question deleted successfully',
        success: true,
      });
    } catch (error) {}
  }
);

export default router;

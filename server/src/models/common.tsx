import { Exams } from './examModel';
import { Questions } from './questionsModel';
import { Report } from './reportModel';
import { getModelForClass } from '@typegoose/typegoose';

export const ExamModel = getModelForClass(Exams);
export const QuestionsModel = getModelForClass(Questions);
export const ReportModel = getModelForClass(Report);

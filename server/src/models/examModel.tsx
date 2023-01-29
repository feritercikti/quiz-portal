import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Questions } from './questionsModel';
import * as mongoose from 'mongoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Exams {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public duration!: number;

  @prop({ required: true })
  public category!: string;

  @prop({ required: true })
  public totalMarks!: number;

  @prop({ required: true })
  public passingMarks!: number;

  @prop({ required: true, ref: () => Questions })
  public questions!: Ref<Questions>[];
}

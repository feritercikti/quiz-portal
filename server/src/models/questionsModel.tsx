import { prop, modelOptions, Ref, Severity } from '@typegoose/typegoose';
import { Exams } from './examModel';
import * as mongoose from 'mongoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
export class Questions {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public correctOption!: string;

  @prop({ required: true })
  public options!: object;

  @prop({ ref: () => Exams })
  public exam?: Ref<Exams>;
}

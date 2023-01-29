import { prop, modelOptions, Ref, Severity } from '@typegoose/typegoose';
import { User } from './userModel';
import { Exams } from './examModel';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
export class Report {
  @prop({ ref: () => User })
  public user?: Ref<User>;

  @prop({ ref: () => Exams })
  public exam?: Ref<Exams>;

  @prop({ required: true })
  public result!: object;
}

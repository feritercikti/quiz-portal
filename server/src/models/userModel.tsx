import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: false })
  public isAdmin?: boolean;
}

export const UserModel = getModelForClass(User);

/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({
    unique: true,
    maxLength: 50,
    default: '',
    index: true,
    lowercase: true,
  })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, minlength: 11, maxlength: 11 })
  phone: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

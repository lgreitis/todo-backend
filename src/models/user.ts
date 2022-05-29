import { Document, model, Model, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password_hash: string;
  email: string;
  status: ['Blocked', 'Unblocked'];
  credits: number;
  profit: number;
  type: ['Member', 'Administrator'];
  email_confirmed: boolean;
  age: number;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Blocked', 'Unblocked'], required: true, default: 'Unblocked' },
  credits: { type: Number, required: true, default: 1000 },
  profit: { type: Number, required: true, default: 0 },
  type: { type: String, enum: ['Member', 'Administrator'], required: true, default: 'Member' },
  email_confirmed: { type: Boolean, required: true, default: false },
  age: { type: Number, required: true },
});

export const User: Model<IUser> = model('User', UserSchema);

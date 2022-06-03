import { Document, model, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password_hash: string;
  email: string;
  role: ['User', 'Administrator'];
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['User', 'Administrator'], required: true, default: 'User' },
});

export const User: Model<IUser> = model('User', UserSchema);

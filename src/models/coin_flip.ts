import { Document, model, Model, Schema } from 'mongoose';

import { IUser } from './user';

export interface ICoinFlip extends Document {
  name: string;
  bet: number;
  hash: string;
  winners_number: number;
  host_number: number;
  hidden: boolean;
  user: [string | IUser];
}

const CoinFlipSchema = new Schema({
  name: { type: String, required: true },
  bet: { type: Number, required: true },
  hash: { type: String, required: true },
  winners_number: { type: Number, required: true },
  host_number: { type: Number, required: true },
  hidden: { type: Boolean, required: true, default: false },
  user: { type: [Schema.Types.ObjectId], ref: 'User', required: true },
});

export const CoinFlip: Model<ICoinFlip> = model('CoinFlip', CoinFlipSchema);

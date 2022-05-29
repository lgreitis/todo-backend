import { Document, model, Model, Schema } from 'mongoose';

export interface ICoinFlip extends Document {
  hash: string;
  winners_number: number;
  user: [string];
}

const CoinFlipSchema = new Schema({
  hash: { type: String, required: true },
  winners_number: { type: Number, required: true },
  user: { type: [Schema.Types.ObjectId], ref: 'User', required: true },
});

export const CoinFlip: Model<ICoinFlip> = model('CoinFlip', CoinFlipSchema);

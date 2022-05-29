import { Document, model, Model, Schema } from 'mongoose';

import { ITransaction, Transaction } from './transaction';

interface IRouletteBid extends Document, ITransaction {
  user: string;
  ammount: number;
}

const RouletteBidSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  color: { type: String, enum: ['Black', 'Red', 'Green'], required: true },
  ...Transaction,
});

export const RouletteBid: Model<IRouletteBid> = model('RouletteBid', RouletteBidSchema);

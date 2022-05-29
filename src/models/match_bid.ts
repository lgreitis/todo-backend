import { Document, model, Model, Schema } from 'mongoose';

import { ITransaction, Transaction } from './transaction';

interface IMatchBid extends Document, ITransaction {
  user: string;
  team: number;
}

const MatchBidSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Number, required: true },
  ...Transaction,
});

export const MatchBid: Model<IMatchBid> = model('MatchBid', MatchBidSchema);

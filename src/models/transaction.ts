import { Document, model, Model, Schema } from 'mongoose';

export interface ITransaction extends Document {
  user: string;
  date: Date;
  sum: number;
}

const TransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  sum: { type: Number, required: true },
});

export const Transaction: Model<any> = model('Transaction', TransactionSchema);

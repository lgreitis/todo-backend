import { Document, model, Model, Schema } from 'mongoose';

import { ITransaction, Transaction } from './transaction';

interface IPayment extends Document, ITransaction {
  ammount: number;
}

const PaymentSchema = new Schema({
  ammount: { type: Number, required: true },
  ...Transaction,
});

export const Payment: Model<IPayment> = model('Payment', PaymentSchema);

import { Document, model, Model, Schema } from 'mongoose';

export interface IRouletteGame extends Document {
  round: number;
  victory_number: number;
  date: Date;
  roulette_bid_id: string;
}

const RouletteGameSchema = new Schema({
  round: { type: Number, required: true },
  victory_number: { type: Number, required: true },
  date: { type: Date, required: true },
  roulette_bid_id: { type: Schema.Types.ObjectId, ref: 'RouletteBid', required: true },
});

export const RouletteGame: Model<IRouletteGame> = model('RouletteGame', RouletteGameSchema);

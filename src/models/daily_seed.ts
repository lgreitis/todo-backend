import { Document, model, Model, Schema } from 'mongoose';

import { ICoinFlip } from './coin_flip';
import { IRouletteGame } from './roulette_game';

interface IDailySeed extends Document {
  seed: string;
  date: Date;
  seed_hash: string;
  roulette_seed: [IRouletteGame];
  coin_flip_hash: [ICoinFlip];
}

const DailySeedSchema = new Schema({
  seed: { type: String, required: true },
  date: { type: Date, required: true },
  seed_hash: { type: String, required: true },
  roulette_seed: { type: [Schema.Types.ObjectId], ref: 'RouletteGame', required: true },
  coin_flip_hash: { type: [Schema.Types.ObjectId], ref: 'CoinFlip', required: true },
});

export const DailySeed: Model<IDailySeed> = model('DailySeed', DailySeedSchema);

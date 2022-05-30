import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IMatchBid {
  user: string;
  team: number;
  bet: number;
}

export interface IMatch extends Document {
  api_id: number;
  date: Date;
  ended: boolean;
  paid_out: boolean;
  end_date: Date;
  winner: number;
  first_team: string;
  second_team: string;
  first_team_coef: number;
  second_team_coef: number;
  users: IMatchBid[];
}

const MatchBidSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', requred: true },
  team: { type: Number, requred: true },
  bet: { type: Number, requred: true },
});

const MatchSchema = new Schema({
  api_id: { type: Number, required: true },
  date: { type: Date, required: true },
  ended: { type: Boolean, required: true },
  paid_out: { type: Boolean, required: true },
  end_date: { type: Date },
  winner: { type: Number },
  first_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  second_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  first_team_coef: { type: Number, required: true },
  second_team_coef: { type: Number, required: true },
  users: { type: [MatchBidSchema] },
});

export const Match: Model<IMatch> = model('Match', MatchSchema);

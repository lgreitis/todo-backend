import { Document, model, Model, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  api_id: number;
}

const TeamSchema = new Schema({
  name: { type: String, required: true },
  api_id: { type: Number, required: true },
});

export const Team: Model<ITeam> = model('Team', TeamSchema);

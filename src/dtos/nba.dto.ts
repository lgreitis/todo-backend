import Joi from 'joi';

export interface MatchBet {
  match_id: string;
  bet: number;
  team: number;
}

export const MatchBetDto = Joi.object({
  match_id: Joi.string().required(),
  bet: Joi.number().required(),
  team: Joi.number().valid(1, 2).required(),
});

export const GetMatchesDto = Joi.object({
  ended: Joi.boolean().required(),
});

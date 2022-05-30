import { MatchBet } from '@dtos/nba.dto';
import { Match } from '@models/match';
import { nbaService } from '@services/nba.service';
import { userService } from '@services/user.service';
import { NextFunction, Request, Response } from 'express';

export const makeBet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: MatchBet = req.body;
    const user = await userService.getById(req.tokenData);

    await nbaService.makeBet(data, user);

    res.status(200).send();
  } catch (err) {
    next(err);
  }
};

export const getMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: { ended?: boolean } = req.query;
    const matches = await Match.find({ ended: data.ended }).populate(['first_team', 'second_team']);

    res.status(200).send({ matches: matches });
  } catch (err) {
    next(err);
  }
};

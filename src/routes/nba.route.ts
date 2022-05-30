import { nbaController } from '@controllers';
import { GetMatchesDto, MatchBetDto } from '@dtos/nba.dto';
import { authMiddleware } from '@middlewares/authentication.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { Router } from 'express';

const router = Router();

const path = '/match';

router.get(`${path}`, validationMiddleware(GetMatchesDto, 'query'), nbaController.getMatches);

router.post(
  `${path}/bet`,
  authMiddleware,
  validationMiddleware(MatchBetDto, 'body'),
  nbaController.makeBet
);

export default { router, path };

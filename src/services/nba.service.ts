import { HttpException } from '@/exceptions/HttpException';
import { MatchBet } from '@dtos/nba.dto';
import { NBAMatch } from '@interfaces/nba.interface';
import { IMatch, Match } from '@models/match';
import { Team } from '@models/team';
import { IUser, User } from '@models/user';
import { logger } from '@utils/logger';
import axios from 'axios';
import moment from 'moment';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';

const scheduler = new ToadScheduler();

export const initFetch = () => {
  const job = new SimpleIntervalJob({ minutes: 1, seconds: 10 }, task);

  scheduler.addSimpleIntervalJob(job);
};

const task = new AsyncTask('nbaTask', async () => {
  logger.info('Running NBA task');

  const matches = await Match.find({ ended: false }).sort({ date: 1 });

  let apiSearchStartDate = moment().subtract(1, 'days').format('YYYY-MM-DD');

  if (matches.length > 0) {
    apiSearchStartDate = moment(matches[0].date).format('YYYY-MM-DD');
  }

  const games = await axios.get('https://www.balldontlie.io/api/v1/games', {
    params: { start_date: apiSearchStartDate, per_page: 100, page: 1, postseason: true },
  });

  const fetchedMatches: NBAMatch[] = games.data.data;

  const matchesToSave: IMatch[] = [];

  for (const match of fetchedMatches) {
    const existingMatch = await Match.findOne({ api_id: match.id });

    if (existingMatch) {
      // if match already exists, check if it's ended and pay out if it is
      if (match.time === '' && match.status === 'Final') {
        existingMatch.ended = true;
        existingMatch.end_date = new Date();
        if (match.home_team_score > match.visitor_team_score) {
          existingMatch.winner = 1;
        } else {
          existingMatch.winner = 2;
        }
        await existingMatch.save();
        for (let i = 0; i < existingMatch.users.length; i++) {
          const user = existingMatch.users[i];
          if (user.team === existingMatch.winner) {
            const dbUser = await User.findById(user.user);
            if (dbUser) {
              dbUser.credits +=
                user.bet * existingMatch.winner === 1
                  ? existingMatch.first_team_coef
                  : existingMatch.second_team_coef;

              await dbUser.save();
            }
          }
        }
      }

      continue;
    }

    let team1 = await Team.findOne({ api_id: match.home_team.id });
    let team2 = await Team.findOne({ api_id: match.visitor_team.id });

    if (!team1) {
      team1 = await Team.create({
        api_id: match.home_team.id,
        name: match.home_team.name,
      });
    }

    if (!team2) {
      team2 = await Team.create({
        api_id: match.visitor_team.id,
        name: match.visitor_team.name,
      });
    }

    const newMatch = new Match({
      api_id: match.id,
      date: match.date,
      ended: match.time === '' && match.status === 'Final',
      paid_out: false,
      first_team: team1._id,
      second_team: team2._id,
      first_team_coef: 0,
      second_team_coef: 0,
    });

    matchesToSave.push(newMatch);
  }

  Match.insertMany(matchesToSave);
});

const makeBet = async (data: MatchBet, user: IUser) => {
  const match = await Match.findById(data.match_id);

  if (!match) {
    throw new HttpException(400, 'Match not found');
  }
  if (user.credits < data.bet) {
    throw new HttpException(400, 'Not enough credits');
  }

  match.users.push({
    user: user._id,
    team: data.team,
    bet: data.bet,
  });

  await match.save();

  user.credits -= data.bet;
  await user.save();

  await calculateMatchCoefs(match._id);
};

const calculateMatchCoefs = async (matchId: string) => {
  const match = await Match.findById(matchId).populate('users');

  if (!match) {
    throw new HttpException(500, 'Server error');
  }

  let team1sum = 0;
  let team2sum = 0;

  for (const user of match.users) {
    if (user.team === 1) {
      team1sum += user.bet;
    } else {
      team2sum += user.bet;
    }
  }

  const [team1coef, team2coef] = await Promise.all([
    calculateTeamCoefs(team1sum, team1sum + team2sum),
    calculateTeamCoefs(team2sum, team1sum + team2sum),
  ]);

  match.first_team_coef = team1coef;
  match.second_team_coef = team2coef;

  await match.save();
};

const calculateTeamCoefs = async (team: number, sum: number) => {
  const coef = team / sum;
  return 1 / coef !== Infinity ? 1 / coef : 0;
};

export const nbaService = { makeBet };

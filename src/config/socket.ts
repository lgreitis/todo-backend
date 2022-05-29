import { logger } from '@utils/logger';
import * as crypto from 'crypto';
import { Server } from 'http';
import { Server as IOServer } from 'socket.io';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';

import { redisClient } from './redis';

const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14,
  31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

interface BetMsg {
  color: 'red' | 'black' | 'green';
  bet: string;
}

interface RollInfo {
  randomness: number;
  result: number;
}

const scheduler = new ToadScheduler();

const socketConfig = (server: Server) => {
  const io = new IOServer(server, {
    cors: { origin: '*' },
  });

  const task = new AsyncTask(
    'timeTask',
    async () => {
      const time = Date.now();
      const lastRoll: RollInfo = JSON.parse(await redisClient.get('lastRoll'));
      await redisClient.set('time', time);
      io.emit('rollInfo', { rollTime: time, ...lastRoll });

      // Generating result
      setTimeout(async () => {
        const result = await generateResult(
          '55ff2bdf872f9e2fc85aa8c40309841503fa21aeecb0ba565d4534e43f71a9fd'
        );
        const randomness = Math.random();
        await redisClient.set('lastRoll', JSON.stringify({ result, randomness }));
        io.emit('rouletteResult', { randomness, result });
      }, 30000);
      // Paying out
      setTimeout(async () => {
        const res: RollInfo = JSON.parse(await redisClient.get('lastRoll'));

        let color = '';
        const index = numbers.findIndex(num => num === res.result);
        if (index == 0) {
          color = 'green';
        } else if (index % 2 == 1) {
          color = 'red';
        } else {
          color = 'black';
        }

        const winner = await redisClient.ZRANGE_WITHSCORES(`bets:${color}`, 0, -1);
        for (let i = 0; i < winner.length; i++) {
          const element = winner[i];
          const winnings = element.score * (color === 'green' ? 14 : 2);
          await payout(element.value, winnings);
        }

        await redisClient.del(`bets:green`);
        await redisClient.del(`bets:red`);
        await redisClient.del(`bets:black`);

        io.emit('updateCurrency');
      }, 38000);
    },
    (err: Error) => {
      logger.error(err);
    }
  );

  const job = new SimpleIntervalJob({ seconds: 40 }, task);

  scheduler.addSimpleIntervalJob(job);

  io.on('connection', async socket => {
    const name = socket.request.headers['name'] as string;
    console.log(`User ${name} connected`);

    await redisClient.set(`user:${name}`, 1000);
    const time = parseInt(await redisClient.get('time'));
    const lastRoll: RollInfo = JSON.parse(await redisClient.get('lastRoll'));
    socket.emit('initMessage', { currency: 1000, rollTime: time, ...lastRoll });

    socket.on('currency', async () => {
      const currency = await redisClient.get(`user:${name}`);
      socket.emit('currency', { currency });
    });

    socket.on('rollInfo', async () => {
      const time = parseInt(await redisClient.get('time'));
      const lastRoll: RollInfo = JSON.parse(await redisClient.get('lastRoll'));
      socket.emit('rollInfo', { rollTime: time, ...lastRoll });
    });

    socket.on('bet', async (msg: BetMsg) => {
      const currency = await getUserCurrency(name);
      const bet = parseInt(msg.bet);

      if (!checkIfBetIsValid(currency, bet)) {
        socket.emit('error', { error: 'Not enough currency' });
        return;
      }

      await setUserCurrency(name, currency, bet);
      socket.emit('initMessage', { currency: currency - bet });

      await redisClient.zAdd(`bets:${msg.color}`, { score: bet, value: name });

      const update = await redisClient.ZRANGE_WITHSCORES(`bets:${msg.color}`, 0, 10);
      io.emit(`bets:${msg.color}`, update);
    });

    socket.on('disconnect', () => {
      console.log(`User ${name} disconnected`);
    });
  });
};

export default socketConfig;

const payout = (name: string, ammount: number) => {
  return redisClient.incrBy(`user:${name}`, ammount);
};

const setUserCurrency = (name: string, currency: number, bet: number) => {
  return redisClient.set(`user:${name}`, currency - bet);
};

const getUserCurrency = async (name: string) => {
  return parseInt(await redisClient.get(`user:${name}`));
};

const checkIfBetIsValid = (currency: number, bet: number) => {
  if (bet > currency) {
    return false;
  }
  return true;
};

const generateResult = async (secret: string) => {
  const roundNumber = await getRoundNumber();
  const fullSeed = crypto.createHash('sha256').update(`${secret}:${roundNumber}`).digest('hex');
  const seed = fullSeed.substring(0, 8);
  await incrementRoundNumber();
  return parseInt(seed, 16) % 36;
};

const getRoundNumber = async () => {
  return parseInt(await redisClient.get('rolls'));
};

const incrementRoundNumber = async () => {
  await redisClient.incr('rolls');
};

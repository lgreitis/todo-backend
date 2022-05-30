import { DailySeed } from '@/models/daily_seed';
import { socketAuthMiddleware } from '@/socketHandlers/socketAuth.middleware';
import {
  BetMsg,
  LeaderboardValue,
  RollInfo,
  RoomCreateMsg,
  Seeds,
} from '@interfaces/socket.interface';
import { CoinFlip } from '@models/coin_flip';
import { IUser, User } from '@models/user';
import { logger } from '@utils/logger';
import * as crypto from 'crypto';
import { Server } from 'http';
import moment from 'moment';
import { scheduleJob } from 'node-schedule';
import { Server as IOServer } from 'socket.io';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';

import { redisClient } from './redis';

const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14,
  31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const scheduler = new ToadScheduler();

const socketConfig = (server: Server) => {
  setSeeds();
  const io = new IOServer(server, {
    cors: { origin: '*' },
  });

  const task = new AsyncTask(
    'timeTask',
    async () => {
      const time = Date.now();
      const lastRoll: RollInfo = JSON.parse((await redisClient.get('lastRoll')) as string);
      await redisClient.set('time', time);
      io.emit('rollInfo', { rollTime: time, ...lastRoll, current_time: Date.now() });

      // Generating result
      setTimeout(async () => {
        const seeds: Seeds = JSON.parse((await redisClient.get('seed')) as string);
        const result = await generateResult(seeds.todays);
        const randomness = Math.random();
        await redisClient.set('lastRoll', JSON.stringify({ result, randomness }));
        io.emit('rouletteResult', { randomness, result });
      }, 30000);

      // Paying out
      setTimeout(async () => {
        const res: RollInfo = JSON.parse((await redisClient.get('lastRoll')) as string);

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
        const payoutArr = [];
        for (let i = 0; i < winner.length; i++) {
          const element = winner[i];
          const value: LeaderboardValue = JSON.parse(element.value);
          const winnings = element.score * (color === 'green' ? 14 : 2);
          payoutArr.push(payout(value.id, value.name, winnings));
        }

        await Promise.all([
          ...payoutArr,
          redisClient.del(`bets:green`),
          redisClient.del(`bets:red`),
          redisClient.del(`bets:black`),
        ]);

        io.emit('updateCurrency');
      }, 38000);
    },
    (err: Error) => {
      logger.error(err);
    }
  );

  const job = new SimpleIntervalJob({ seconds: 40, runImmediately: true }, task);

  scheduler.addSimpleIntervalJob(job);

  io.use(socketAuthMiddleware);

  io.on('connection', async socket => {
    const user: IUser | undefined = socket.data.user;

    socket.on('getSeeds', async () => {
      const seeds: Seeds = JSON.parse((await redisClient.get('seed')) as string);
      socket.emit('getSeeds', seeds);
    });

    socket.on('getCoinFlipRooms', async ({ bet = 1, name = 1 }: { bet: number; name: number }) => {
      socket.data.sortCache = { bet, name };
      const rooms = await CoinFlip.find({ hidden: false }).sort({ bet: bet, name: name });
      socket.emit('coinFlipRooms', rooms);
    });

    socket.on('rollInfo', async () => {
      const time = parseInt((await redisClient.get('time')) as string);
      const lastRoll: RollInfo = JSON.parse((await redisClient.get('lastRoll')) as string);
      socket.emit('rollInfo', { rollTime: time, ...lastRoll, current_time: Date.now() });
    });

    socket.on('getBetters', async () => {
      const update2 = await redisClient.ZRANGE_WITHSCORES('bets:black', 0, -1);
      io.emit('bets:black', update2);
      const update1 = await redisClient.ZRANGE_WITHSCORES('bets:green', 0, -1);
      io.emit('bets:green', update1);
      const update3 = await redisClient.ZRANGE_WITHSCORES('bets:red', 0, -1);
      io.emit('bets:red', update3);
    });

    if (!user) {
      console.log('Guest connected');
      const lastRoll: RollInfo = JSON.parse((await redisClient.get('lastRoll')) as string);
      const time = parseInt((await redisClient.get('time')) as string);
      socket.emit('initMessage', {
        currency: 0,
        rollTime: time,
        ...lastRoll,
        current_time: Date.now(),
      });
      socket.on('joinCoinFlipRoom', async (msg: { id: string; watch: boolean }) => {
        const room = await CoinFlip.findById(msg.id).populate('user');
        if (!room) {
          return;
        }
        socket.emit('coinFlipRoomInfo', {
          name: room.name,
          bet: room.bet,
          number: room.host_number,
          hash: room.hash,
          host: false,
          host_name: (room.user[0] as IUser).username,
        });
        socket.join(msg.id);
      });
      socket.on('disconnect', () => {
        console.log(`Guest disconnected`);
      });
      return;
    }

    console.log(`User ${user.username} connected`);

    await redisClient.set(`user:${user.username}`, user.credits);
    const time = parseInt((await redisClient.get('time')) as string);
    const lastRoll: RollInfo = JSON.parse((await redisClient.get('lastRoll')) as string);
    socket.emit('initMessage', {
      currency: user.credits,
      rollTime: time,
      ...lastRoll,
      current_time: Date.now(),
    });

    socket.on('currency', async () => {
      const currency = await redisClient.get(`user:${user.username}`);
      socket.emit('currency', { currency });
    });

    socket.on('initCoinFlipCreation', () => {
      const hash = crypto.randomBytes(20).toString('hex');
      socket.data.hash = hash;
      socket.emit('initCoinFlipCreation', hash);
    });

    socket.on('createCoinFlipRoom', async (msg: RoomCreateMsg) => {
      const room = await CoinFlip.create({
        name: msg.name,
        bet: msg.bet,
        hash: socket.data.hash,
        winners_number: 0,
        user: [user.id],
        host_number: msg.number,
      });
      await User.findByIdAndUpdate(user.id, { $inc: { credits: -room.bet } });
      await redisClient.decrBy(`user:${user.username}`, room.bet);
      socket.emit('coinFlipRoomCreated', { id: room._id, name: room.name, bet: room.bet });
      io.emit('updateRooms');
    });

    socket.on('joinCoinFlipRoom', async (msg: { id: string; watch: boolean }) => {
      const room = await CoinFlip.findById(msg.id).populate('user');
      if (!room) {
        return;
      }
      socket.emit('coinFlipRoomInfo', {
        name: room.name,
        bet: room.bet,
        number: room.host_number,
        hash: room.hash,
        host: (room.user[0] as IUser).username === user.username,
        host_name: (room.user[0] as IUser).username,
      });
      socket.join(msg.id);
      if (room.user.length > 1) {
        return;
      }
      if (room.user.length > 0 && !msg.watch) {
        if (!room.user.some(e => (e as IUser)._id.toString() === user.id)) {
          await Promise.all([
            room.user.push(user.id),
            User.findByIdAndUpdate(user.id, { $inc: { credits: -room.bet } }).exec(),
            redisClient.decrBy(`user:${user.username}`, room.bet),
          ]);

          await room.save();
        }

        if (room.user.length > 1) {
          io.to(msg.id).emit('coinFlipJoinedUser', user.username);

          setTimeout(async () => {
            const room = await CoinFlip.findById(msg.id).populate('user');
            if (!room) {
              return;
            }
            const seeds: Seeds = JSON.parse((await redisClient.get('seed')) as string);
            const rand = (await generateCoinFlipResult(seeds.todays, room.hash)) + 1;
            let winnerint = -1;
            if (room.host_number === rand) {
              winnerint = 0;
            } else {
              winnerint = 1;
            }
            const winner = room.user[winnerint] as IUser;
            console.log(winner.username);
            await User.findByIdAndUpdate(winner._id, { $inc: { credits: room.bet * 2 } }).exec();
            await redisClient.incrBy(`user:${winner.username}`, room.bet * 2);
            await CoinFlip.findByIdAndUpdate(msg.id, {
              $set: { winners_number: rand, hidden: true },
            });
            io.emit('updateRooms');
            io.to(msg.id).emit('coinFlipStart', rand);
          }, 3000);
        }
      }
    });

    socket.on('bet', async (msg: BetMsg) => {
      const currency = await getUserCurrency(user.username);
      const bet = parseInt(msg.bet);

      if (!checkIfBetIsValid(currency, bet)) {
        socket.emit('error', { error: 'Not enough currency' });
        return;
      }

      await setUserCurrency(user._id, user.username, currency, bet);
      socket.emit('currency', { currency: `${currency - bet}` });

      await redisClient.zAdd(`bets:${msg.color}`, {
        score: bet,
        value: JSON.stringify({ name: user.username, id: user._id }),
      });

      const update = await redisClient.ZRANGE_WITHSCORES(`bets:${msg.color}`, 0, -1);
      io.emit(`bets:${msg.color}`, update);
    });

    socket.on('disconnect', () => {
      console.log(`User ${user.username} disconnected`);
    });
  });
};

export default socketConfig;

const payout = (id: string, name: string, ammount: number) => {
  return Promise.all([
    redisClient.incrBy(`user:${name}`, ammount),
    User.findByIdAndUpdate(id, { $inc: { credits: ammount } }).exec(),
  ]);
};

const setUserCurrency = (id: string, name: string, currency: number, bet: number) => {
  return Promise.all([
    redisClient.decrBy(`user:${name}`, bet),
    User.findByIdAndUpdate(id, { $inc: { credits: -bet } }).exec(),
  ]);
};

const getUserCurrency = async (name: string) => {
  return parseInt((await redisClient.get(`user:${name}`)) as string);
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

const generateCoinFlipResult = async (secret: string, roomHash: string) => {
  const fullSeed = crypto.createHash('sha256').update(`${secret}:${roomHash}`).digest('hex');
  const seed = fullSeed.substring(0, 8);
  return parseInt(seed, 16) % 2;
};

const getRoundNumber = async () => {
  return parseInt((await redisClient.get('rolls')) as string);
};

const incrementRoundNumber = async () => {
  await redisClient.incr('rolls');
};

scheduleJob('* * 1 * * *', async () => {
  const dailySeed = crypto.randomBytes(32).toString('hex');
  const dailySeedHash = crypto.createHash('sha256').update(dailySeed).digest('hex');
  DailySeed.create({ seed: dailySeed, date: Date.now(), seed_hash: dailySeedHash });
});

const setSeeds = async () => {
  const yesterday = moment()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .subtract(1, 'day')
    .toDate();
  const today = moment().set('hour', 0).set('minute', 0).set('second', 0).toDate();
  const todaysSeed = await DailySeed.findOne({ date: { $gte: today } });
  const yesterdays = await DailySeed.findOne({ date: { $gte: yesterday, $lt: today } });
  if (todaysSeed && yesterdays) {
    await redisClient.set(
      `seed`,
      JSON.stringify({ yesterdays: yesterdays.seed, todays: todaysSeed.seed_hash })
    );
  }
};

export interface BetMsg {
  color: 'red' | 'black' | 'green';
  bet: string;
}

export interface RollInfo {
  randomness: number;
  result: number;
}

export interface LeaderboardValue {
  name: string;
  id: string;
}

export interface RoomCreateMsg {
  name: string;
  bet: number;
  number: number;
}

export interface Seeds {
  yesterdays: string;
  todays: string;
}

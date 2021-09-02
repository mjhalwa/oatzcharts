export type MeasureData = {
  total?: {
    value: number;
    rank: number;
  };
  avg: {
    value: number;
    rank: number;
  };
}

export type PlayerData = {
  rank: number;
  name: string;
  score: MeasureData;
  goals: MeasureData;
  assists: MeasureData;
  saves: MeasureData;
  shots: MeasureData;
  speed: MeasureData;
  ranks_total_value: number;
};

export type TeamData = {
  name: string;
  wins: number;
  losses: number;
  perc: number;
};

export type PlayerGameData = {
  name: string;
  score: number;
  goals: number;
  assists: number;
  saves: number;
  shots: number;
};

export type GameData = {
  id: string;
  created: string;
  blue: {
    goals: number;
    players: PlayerGameData[];
  }
  orange: {
    goals: number;
    players: PlayerGameData[];
  }
};

export type ChartData = {
  content: {
    name: string;
    id: string;
    players: PlayerData[];
    teams: TeamData[];
    games: GameData[];
  };
};

// load json files
// using profiler: see https://stackoverflow.com/questions/33650399/es6-modules-implementation-how-to-load-a-json-file/33650470#33650470
//  import Profile from './components/profile';
//  import chartdata from 'json!../data.json';
// easier version: https://stackoverflow.com/a/52349546
export let data : ChartData[] = require('./data.json');

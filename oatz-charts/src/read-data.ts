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

type RawPlayerData = {
  rank: number;
  games: number;
  name: string;
  score: MeasureData;
  goals: MeasureData;
  assists: MeasureData;
  saves: MeasureData;
  shots: MeasureData;
  speed: MeasureData;
  ranks_total_value: number;
};

export type PlayerData = {
  rank: number;
  games: number;
  name: string;
  measures: {[key: string]: MeasureData};
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

export type RawChartData = {
  name: string;
  id: string;
  date: string;
  players: RawPlayerData[];
  teams: TeamData[];
  games: GameData[];
};

export type ChartData = {
  name: string;
  id: string;
  date: string;
  players: PlayerData[];
  teams: TeamData[];
  games: GameData[];
};

// load json files
// using profiler: see https://stackoverflow.com/questions/33650399/es6-modules-implementation-how-to-load-a-json-file/33650470#33650470
//  import Profile from './components/profile';
//  import chartdata from 'json!../data.json';
// easier version: https://stackoverflow.com/a/52349546
const offlineRawData : RawChartData[] = require('./data.json');

// convert RawPlayerData to PlayerData
export function fromRawData(rawData: RawChartData[]): ChartData[] {
  return rawData.map((rawElem: RawChartData) => {
    return {
      name: rawElem.name,
      id: rawElem.id,
      date: rawElem.date,
      players: rawElem.players.map((val: RawPlayerData) => {
        return {
          rank: val.rank,
          games: val.games,
          name: val.name,
          measures: {
            score: val.score,
            goals: val.goals,
            assists: val.assists,
            saves: val.saves,
            shots: val.shots,
            speed: val.speed
          },
          ranks_total_value: val.ranks_total_value
        }
      }),
      teams: rawElem.teams,
      games: rawElem.games
    };
  });
}

export const data: ChartData[] = fromRawData(offlineRawData);

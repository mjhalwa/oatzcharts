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

export type RawPlayerData = {
  rank: number;
  games: number;
  name: string;

  score: MeasureData;
  shots: MeasureData;
  goals: MeasureData;
  assists: MeasureData;
  saves: MeasureData;
  kills: MeasureData;
  deaths: MeasureData;
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

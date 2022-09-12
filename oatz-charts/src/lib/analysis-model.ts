export type MeasureSummary = {
  avg: number;
  sum: number;
  max: {
    value: number;
    dates: string[];
  };
  min: {
    value: number;
    dates: string[];
  };
};

export type PlayerStats = {
  dayCount: number;
  measures: {[key: string]: MeasureSummary};
};

export type Limits = {
  min: {
    value: number;
    player: {
      name: string;
      dates: string[];
    }[];
  };
  max: {
    value: number;
    player: {
      name: string;
      dates: string[];
    }[];
  };
}

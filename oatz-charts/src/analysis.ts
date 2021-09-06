import {ChartData} from './read-data';

export type MeasureSummary = {
  sum: number;
  avg: number;
  max: number;
};

export type PlayerStats = {
  dayCount: number;
  measures: {[key: string]: MeasureSummary};
};

function getInitStats(measureKeys: string[]): PlayerStats {
  const initSummary: MeasureSummary = {
    sum: 0,
    avg: 0,
    max: 0
  };
  let playerStats: PlayerStats = {
    dayCount: 0,
    measures: {}
  };
  for (const m of measureKeys) {
    playerStats.measures[m] = initSummary;
  }

  return playerStats;
}

// TODO: add parameter condition (=callback function to return true/false wether or not to include in stats)
export function calcStats(data: ChartData[]): {[player: string]: PlayerStats } {
  let stats: {[playerName: string]: PlayerStats } = {};

  const measureNames = Object.keys(data[0].players[0].measures)

  for ( const dayData of data ) {
    for ( const playerDayData of dayData.players ) {
      const playerName = playerDayData.name;
      if ( ! ( playerName in stats ) ) {
        // init player stats 
        // warning: we need a deep copy here!
        // TODO: use lodash instead of JSON.parse(JSON.stringify()) here
        stats[playerName] = JSON.parse(JSON.stringify(getInitStats(measureNames)));
      }
      stats[playerName].dayCount += 1;
      for ( const m of measureNames ) {
        // increment stats of player to calculate sum
        stats[playerName].measures[m].sum += playerDayData.measures[m].avg.value
        // check for max
        if (playerDayData.measures[m].avg.value > stats[playerName].measures[m].max) {
          stats[playerName].measures[m].max = playerDayData.measures[m].avg.value;
        }
      }
    }
  }
  // calculate averages
  for (const name in stats) {
    for ( let m in stats[name].measures ) {
      stats[name].measures[m].avg = stats[name].measures[m].sum/stats[name].dayCount;
    }
  }
  return stats;
}

export function getAllPlayerMaxStats(data: ChartData[]): {[measureName: string]: number} {
  const stats = calcStats(data);

  let maxes: {[measureName: string]: number} = {};

  const measureNames = Object.keys(data[0].players[0].measures)
  for (const name of measureNames) {
    maxes[name] = 0;
  }

  for (const player in stats) {
    for ( const measureName in stats[player].measures ) {
      if ( stats[player].measures[measureName].max > maxes[measureName] ) {
        maxes[measureName] = stats[player].measures[measureName].max;
      }
    }
  }

  return maxes;
};

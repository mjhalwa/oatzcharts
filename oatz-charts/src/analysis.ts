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
  let stats: {[player: string]: PlayerStats } = {};

  for ( const daystats of data ) {
    for ( const player of daystats.players ) {
      if ( ! ( player.name in stats ) ) {
        // init player stats
        const measureNames = Object.keys(data[0].players[0].measures)
        stats[player.name] = getInitStats(measureNames);
      }
      stats[player.name].dayCount += 1;
      for ( const m in stats[player.name].measures ) {
        // increment stats of player to calculate sum
        stats[player.name].measures[m].sum += player.measures[m].avg.value
        // check for max
        if (player.measures[m].avg.value > stats[player.name].measures[m].max) {
          stats[player.name].measures[m].max = player.measures[m].avg.value;
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

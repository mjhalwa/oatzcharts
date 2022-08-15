import { isNull } from 'lodash';
import {ChartData} from './read-data';
// see https://github.com/lodash/lodash/issues/3192
//import cloneDeep from 'lodash/cloneDeep'
//const cloneDeep = require('lodash/cloneDeep')

export type MeasureSummary = {
  sum: number;
  avg: number;
  max: number;
  min: number;
};

export type PlayerStats = {
  dayCount: number;
  measures: {[key: string]: MeasureSummary};
};

function getInitStats(measureKeys: string[]): PlayerStats {
  const initSummary: MeasureSummary = {
    sum: NaN,
    avg: NaN,
    max: NaN,
    min: NaN,
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
        /* tried, but not actually deepcloning... 
        stats[playerName] = cloneDeep(getInitStats(measureNames));
        */
        stats[playerName] = JSON.parse(JSON.stringify(getInitStats(measureNames)));
        for ( const m of measureNames ) {
          stats[playerName].measures[m].sum = playerDayData.measures[m].avg.value
          stats[playerName].measures[m].min = playerDayData.measures[m].avg.value
          stats[playerName].measures[m].max = playerDayData.measures[m].avg.value
        }
      } else {
        for ( const m of measureNames ) {
          // increment stats of player to calculate sum
          stats[playerName].measures[m].sum += playerDayData.measures[m].avg.value
          // check for max
          if (playerDayData.measures[m].avg.value > stats[playerName].measures[m].max) {
            stats[playerName].measures[m].max = playerDayData.measures[m].avg.value;
          }
          // check for min
          if (playerDayData.measures[m].avg.value < stats[playerName].measures[m].min) {
            stats[playerName].measures[m].min = playerDayData.measures[m].avg.value;
          }
        }
      }
      stats[playerName].dayCount += 1;
    }
  }
  // calculate averages
  for (const name in stats) {
    for ( let m in stats[name].measures ) {
      stats[name].measures[m].avg = stats[name].measures[m].sum/stats[name].dayCount;
    }
  }

  //console.log(JSON.parse(JSON.stringify(stats)));
  return stats;
}

export type Limits = {
  min: number;
  max: number;
}

export function getAllPlayerLimitStats(data: ChartData[]): {[measureName: string]: Limits} {
  const stats = calcStats(data);

  let limits: {[measureName: string]: Limits } = {};

  const measureNames = Object.keys(data[0].players[0].measures)
  for (const name of measureNames) {
    limits[name] = {
      min: NaN,
      max: NaN
    }
  }

  for (const player in stats) {
    for ( const measureName in stats[player].measures ) {
      if ( isNaN(limits[measureName].max) || ( stats[player].measures[measureName].max > limits[measureName].max ) ) {
        limits[measureName].max = stats[player].measures[measureName].max;
      }
      if ( isNaN(limits[measureName].min) || ( stats[player].measures[measureName].min < limits[measureName].min ) ) {
        limits[measureName].min = stats[player].measures[measureName].min;
      }
    }
  }

  return limits;
};

/**
 * calculate number of months between two dates
 * @param d1 a date
 * @param d2 another date
 * @returns absolute difference in months between the dates
 */
export function getAbsMonthDiff(d1: Date, d2: Date): number {
  let months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months += d1.getMonth();
  months -= d2.getMonth();
  return months < 0 ? -months : months;
}
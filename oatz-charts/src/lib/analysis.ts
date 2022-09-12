import { isNull } from 'lodash';
import {ChartData} from './read-data-model';
import * as model from './analysis-model';
// see https://github.com/lodash/lodash/issues/3192
//import cloneDeep from 'lodash/cloneDeep'
//const cloneDeep = require('lodash/cloneDeep')

/**
 * @brief helper function to initialize each players stats before calculation
 * @param measureKeys name of all provided measures
 * @returns an initial object
 */
function getInitStats(measureKeys: string[]): model.PlayerStats {
  const initSummary: model.MeasureSummary = {
    avg: NaN,
    sum: NaN,
    max: {
      value: NaN,
      dates: []
    },
    min: {
      value: NaN,
      dates: []
    },
  };
  let playerStats: model.PlayerStats = {
    dayCount: 0,
    measures: {}
  };
  for (const m of measureKeys) {
    playerStats.measures[m] = initSummary;
  }

  return playerStats;
}

/**
 * @brief calculate sum, average, minimum and maximum of each measure for each player
 * @param data 
 * @returns stats for each player
 */
// TODO: add parameter condition (=callback function to return true/false wether or not to include in stats)
export function calcStats(data: ChartData[]): {[player: string]: model.PlayerStats } {
  let stats: {[playerName: string]: model.PlayerStats } = {};

  const measureNames = Object.keys(data[0].players[0].measures)

  for ( const dayData of data ) {
    for ( const playerDayData of dayData.players ) {
      // skip player's data for this day, if only played less than 10 games
      if ( playerDayData.games < 10 ) continue;

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
          stats[playerName].measures[m].min = {
            value: playerDayData.measures[m].avg.value,
            dates: [dayData.date]
          }
          stats[playerName].measures[m].max = {
            value: playerDayData.measures[m].avg.value,
            dates: [dayData.date]
          }
        }
      } else {
        for ( const m of measureNames ) {
          // increment stats of player to calculate sum
          stats[playerName].measures[m].sum += playerDayData.measures[m].avg.value
          // check for max
          if (playerDayData.measures[m].avg.value > stats[playerName].measures[m].max.value) {
            stats[playerName].measures[m].max = {
              value: playerDayData.measures[m].avg.value,
              dates: [dayData.date]
            }
          } else if (playerDayData.measures[m].avg.value === stats[playerName].measures[m].max.value) {
            stats[playerName].measures[m].max.dates.push(dayData.date)
          }
          // check for min
          if (playerDayData.measures[m].avg.value < stats[playerName].measures[m].min.value) {
            stats[playerName].measures[m].min = {
              value: playerDayData.measures[m].avg.value,
              dates: [dayData.date]
            }
          } else if (playerDayData.measures[m].avg.value === stats[playerName].measures[m].min.value) {
            stats[playerName].measures[m].min.dates.push(dayData.date)
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

/**
 * calculate minimum and maximum for each measure over all contributing players
 * @param data 
 * @returns stats for all players
 */
export function getAllPlayerLimitStats(data: ChartData[]): {[measureName: string]: model.Limits} {
  const stats = calcStats(data);

  let limits: {[measureName: string]: model.Limits } = {};

  const measureNames = Object.keys(data[0].players[0].measures)
  for (const name of measureNames) {
    limits[name] = {
      min: {
        value: NaN,
        player: []
      },
      max: {
        value: NaN,
        player: []
      }
    }
  }

  for (const playername in stats) {
    for ( const measureName in stats[playername].measures ) {
      if ( isNaN(limits[measureName].max.value) || ( stats[playername].measures[measureName].max.value > limits[measureName].max.value ) ) {
        limits[measureName].max = {
          value: stats[playername].measures[measureName].max.value,
          player: [{
            name: playername,
            dates: stats[playername].measures[measureName].max.dates
          }]
        };
      } else if ( stats[playername].measures[measureName].max.value === limits[measureName].max.value ) {
        limits[measureName].max.player.push({
          name: playername,
          dates: stats[playername].measures[measureName].max.dates
        })
      }
      if ( isNaN(limits[measureName].min.value) || ( stats[playername].measures[measureName].min.value < limits[measureName].min.value ) ) {
        limits[measureName].min = {
          value: stats[playername].measures[measureName].min.value,
          player: [{
            name: playername,
            dates: stats[playername].measures[measureName].min.dates
          }]
        };
      } else if ( stats[playername].measures[measureName].min.value === limits[measureName].min.value ) {
        limits[measureName].min.player.push({
          name: playername,
          dates: stats[playername].measures[measureName].min.dates
        })
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
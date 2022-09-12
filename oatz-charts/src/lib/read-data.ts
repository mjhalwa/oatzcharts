import * as model from './read-data-model';

/* <--- DID FAIL
 * in fromRawData() return type has 
 *   ..., rank: number | MeasureData; name: string | MeasureData , ...
 * which seems unintended, so we stick to hardcoded type
// for interfaces (BUT WE USE TYPE ALIASES !!)
// see https://stackoverflow.com/questions/61670279/typescript-how-to-specify-a-type-that-allows-arbitrary-additional-keys-to-be-a
// ... so for TYPES:
// see https://blog.logrocket.com/types-vs-interfaces-in-typescript/
type RawPlayerDataBase = {
  rank: number;
  games: number;
  name: string;
  ranks_total_value: number;
}

type RawPlayerDataMeasures = {
  [key: string]: MeasureData;
};

// Intersection Types:
// > This allows you to add together existing types to get a single type that has all the features you need.
// see https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#intersection-types
type RawPlayerData = RawPlayerDataBase & RawPlayerDataMeasures;
*/

// load json files
// using profiler: see https://stackoverflow.com/questions/33650399/es6-modules-implementation-how-to-load-a-json-file/33650470#33650470
//  import Profile from './components/profile';
//  import chartdata from 'json!../data.json';
// easier version: https://stackoverflow.com/a/52349546
const offlineRawData : model.RawChartData[] = require('./data.json');

// convert RawPlayerData to PlayerData
export function fromRawData(rawData: model.RawChartData[]): model.ChartData[] {
  return rawData.map((rawElem: model.RawChartData) => {
    return {
      name: rawElem.name,
      id: rawElem.id,
      date: rawElem.date,
      players: rawElem.players.map((val: model.RawPlayerData) => {
        return {
          rank: val.rank,
          games: val.games,
          name: val.name,
          measures: {
            score: val.score,
            shots: val.shots,
            goals: val.goals,
            assists: val.assists,
            saves: val.saves,
            kills: val.kills,
            deaths: val.deaths,
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

export function getListOfMeasures(chartData: model.ChartData[]): string[] {
  if ( chartData.length > 0 ) {
    return Object.entries(chartData[0].players[0].measures).map( val => val[0] );
  } else {
    return [];
  }
}

export function getListOfPlayerNames(chartData: model.ChartData[]): string[] {
  if ( chartData.length > 0 ) {
    let names: string[] = [];
    for ( const d of chartData ) {
      for ( const name of d.players.map( p => p.name) ) {
        if ( !names.includes(name) ) {
          names.push(name);
        }
      }
    }
    return names;
  } else {
    return [];
  }
}

export function getPlayerColor(playerName: string): string {
  if ( playerName === "wiesl2" ) { return 'rgb(102, 255, 255)'; }
  else if ( playerName === "Grent" ) { return 'rgb(146, 208, 80)'; }
  else if ( playerName === "Ozumi" ) { return 'rgb(255, 192, 0)'; }
  else if ( playerName === "Bergsalz" ) { return 'rgb(164, 12, 4)'; }
  else if ( playerName === "DaPhysika" ) { return 'rgb(112, 48, 160)'; }
  else if ( playerName === "Bianchii" ) { return 'rgb(255, 68, 204)'; }
  else {
    return 'rgb(120,120,120)';
  }
}

export const data: model.ChartData[] = fromRawData(offlineRawData);

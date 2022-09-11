import React from 'react';

import {getAllPlayerLimitStats, Limits} from '../lib/analysis';
import {ChartData} from '../lib/read-data';


type AvgScoreboardProps = {
  allData: ChartData[];
};

type AvgScoreboardStates = {
  allStatsLimits: {[measureName: string]: Limits};
};

export class AvgScoreboard extends React.Component<AvgScoreboardProps, AvgScoreboardStates> {
  state = {
    allStatsLimits: getAllPlayerLimitStats(this.props.allData),
  }

  render() {
    console.log(this.state.allStatsLimits)
    return (
      <table>
        <thead>
          <tr>
            <th>Wert</th>
            <th>Max</th>
            <th>Spieler</th>
            <th>Min</th>
            <th>Spieler</th>
          </tr>
        </thead>
        <tbody>
          { Object.keys(this.state.allStatsLimits).map( measurename => 
              <tr key={measurename}>
                <td>{measurename}</td>
                <td>{this.state.allStatsLimits[measurename].max.value.toFixed(2)}</td>
                <td>{this.state.allStatsLimits[measurename].max.player
                      .map( p => `${p.name} (${p.dates.join(', ')})`)
                      .join(', ')
                    }</td>
                <td>{this.state.allStatsLimits[measurename].min.value.toFixed(2)}</td>
                <td>{this.state.allStatsLimits[measurename].min.player
                      .map( p => `${p.name} (${p.dates.join(', ')})`)
                      .join(', ')
                    }</td>
              </tr>
          )}
        </tbody>
      </table>
    );
  }
}
import React from 'react';

import {getAllPlayerLimitStats} from '../lib/analysis';
import {Limits} from '../lib/analysis-model';
import {getPlayerColor} from '../lib/read-data';
import {ChartData} from '../lib/read-data-model';


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
                <td>
                  <ol>{this.state.allStatsLimits[measurename].max.player
                      .map( p => 
                        <li title={`${p.dates.join('\n')}`} style={{color: getPlayerColor(p.name)}}>{p.name}</li>
                      )
                    }
                  </ol>
                </td>
                <td>{this.state.allStatsLimits[measurename].min.value.toFixed(2)}</td>
                <td>
                  <ol>{this.state.allStatsLimits[measurename].min.player
                      .map( p => 
                        <li title={`${p.dates.join('\n')}`} style={{color: getPlayerColor(p.name)}}>{p.name}</li>
                      )
                    }
                  </ol>
                </td>
              </tr>
          )}
        </tbody>
      </table>
    );
  }
}
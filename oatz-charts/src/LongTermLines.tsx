import React from 'react';
import {Line} from 'react-chartjs-2';
// tree-shakable way to import in react-chartjs-2 v4, see https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Legend, Title, Tooltip } from 'chart.js';
// Note: full list of react-chartjs-2 components: https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
// - LineElement, PointElement, Title ... defaults from Line-example at https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking
// - LinearScale ... required scale for Line-Charts
// - RadialLinearScale ... required scale for Radar-Charts
// - CategoryScale ... browser-error shows category missing on Radar-Charts
// - Legend ... required to show the players (de)selection)
// - Tooltip ... required to show mouse-over tooltips at points in graph

import {ChartData, getPlayerColor} from './read-data';

// registration for tree-shakable way to import in react-chartjs-2 v4
ChartJS.register(LineElement, PointElement, LinearScale, Legend, Title, Tooltip);


type LongTermLinesProps = {
  allData: ChartData[];
  playerNames: string[];
  playerSelect: boolean[];
  selectedMeasure: string;
};

type LongTermLinesStates = {
//  allPlayerData: { [name: string]: number[]};
};

function getAllPlayerData(chartData: ChartData[], selectedMeasure: string, playerNames: string[]): { [name: string]: number[] } {
  let allPlayerData: { [name: string]: number[]} = {};

  //console.log(selectedMeasure);

  // create all null arrays
  for ( const player of playerNames ) {
    allPlayerData[player] = [...Array(chartData.length).fill(null)];
  }

  // replays null at each day for each player (if not present, stays null)
  for ( const i in chartData ) {
    for ( const player of chartData[i].players ) {
        allPlayerData[player.name][Number(i)] = player.measures[selectedMeasure].avg.value;
    }
  }

  return allPlayerData;
}

export class LongTermLines extends React.Component<LongTermLinesProps, LongTermLinesStates> {
  state = {
      //fixes shown data does not change if selectedMeasure changes, when not setting state here, instead recalculate ist within render()
//    allPlayerData: getAllPlayerData(this.props.allData, this.props.selectedMeasure, this.props.playerNames)
  }
  
  render() {
    return (
      // example: https://codesandbox.io/s/5z3ss?file=/src/App.js
      <Line
      data={
        {
          labels: this.props.allData.map( (val, index) => val.date ),
          // Note: removal nonselected players is done by chartjs
//          datasets: Object.entries(this.state.allPlayerData)
          datasets: Object.entries(getAllPlayerData(this.props.allData, this.props.selectedMeasure, this.props.playerNames))
                      .map( ([k, v]) => {return { name: k, values: v };})
                      .map( val => { return {
                        label: val.name,
                        data: val.values,
                        borderColor: getPlayerColor(val.name),
                        lineTension: 0.25
                      };
                    })
          /*
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "First dataset",
              data: [33, 53, 85, 41, NaN, 65],
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)"
            },
            {
              label: "Second dataset",
              data: [33, 25, 35, 51, 54, 76],
              fill: false,
              borderColor: "#742774"
            }
          ]
          */
        }
      }
      options={
        {
          spanGaps: true,
          maintainAspectRatio: false, //!< allows to set a specific height
          plugins: {
            title: {
              display: true,
              text: this.props.selectedMeasure
            }
          }
        }
      }
      />
    );
  }
};

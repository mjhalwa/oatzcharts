import React from 'react';
import {Line} from 'react-chartjs-2';
import {ChartData, getPlayerColor} from './read-data';


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

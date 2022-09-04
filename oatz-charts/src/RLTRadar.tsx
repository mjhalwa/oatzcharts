import React from 'react';
import 'chart.js/auto'; // lazy migration to react-chartjs-4, see https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking
import {Radar} from 'react-chartjs-2';
import {ChartData, getPlayerColor} from './read-data';
import {getAllPlayerLimitStats, Limits} from './analysis';


/* test
  speed:
    grent: 7,
    wiesl: 4,
    daphysika: 8,
  goals:
    grent: 9,
    wiesl: 12,
    daphysika 3

  labels: ["speed", "goals"],
  datasets: [
    {
      label: "grent",
      data: [7, 9],
    }, {
      label: "wiesl",
      data: [4, 12]
    }, {
      label: "daphysika",
      data: [8, 3]
    }
  ]

*/



type InputData = {
  player: string;
  measures: {
    name: string;
    value: number
  }[];
};

type RLTRadarProps = {
  data: InputData[];
  allData: ChartData[];
  title: string;
  relToMinAndMax: boolean;
};

type RLTRadarStates = {
  allStatsLimits: {[measureName: string]: Limits};
};

export class RLTRadar extends React.Component<RLTRadarProps, RLTRadarStates> {
  state = {
    allStatsLimits: getAllPlayerLimitStats(this.props.allData),
  }
  render() {
    return (
      <Radar
      data={
        {
          labels: this.props.data[0].measures.map(m => m.name),
          datasets: this.props.data.map(d => {
            return {
              label: d.player,
              //data: d.measures.map(m => m.value),
              data: this.props.relToMinAndMax
                    ?
                    // rel to min and max
                    d.measures.map(m => ( m.value - this.state.allStatsLimits[m.name].min ) / ( this.state.allStatsLimits[m.name].max - this.state.allStatsLimits[m.name].min )  )
                    // rel to max
                    :
                    d.measures.map(m => m.value/this.state.allStatsLimits[m.name].max),
              fill: false,
              borderColor: getPlayerColor(d.player),
              pointBackgroundColor: getPlayerColor(d.player),
              pointBorderColor: '#fff',
            };
          }),
          /*
          datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 90, 81, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }, {
            label: 'My Second Dataset',
            data: [28, 48, 40, 19, 96, 27, 100],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
          */
        }
      }
      options={
        {
          elements: {
            line: {
              borderWidth: 3
            }
          }, plugins: {
            title: {
              display: true,
              text: this.props.title
            }
          }
          // see https://www.chartjs.org/docs/3.0.2/axes/radial/linear.html
        }
      }
      />
    );
  }
};

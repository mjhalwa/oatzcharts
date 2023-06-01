import React from 'react';
import {Radar} from 'react-chartjs-2';
// tree-shakable way to import in react-chartjs-2 v4, see https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, RadialLinearScale, Legend, Title, Tooltip } from 'chart.js';
// Note: full list of react-chartjs-2 components: https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
// - LineElement, PointElement, Title ... defaults from Line-example at https://react-chartjs-2.js.org/docs/migration-to-v4/#tree-shaking
// - LinearScale ... required scale for Line-Charts
// - RadialLinearScale ... required scale for Radar-Charts
// - CategoryScale ... browser-error shows category missing on Radar-Charts
// - Legend ... required to show the players (de)selection)
// - Tooltip ... required to show mouse-over tooltips at points in graph

import {getPlayerColor} from '../lib/read-data';
import {Limits} from '../lib/analysis-model';

// registration for tree-shakable way to import in react-chartjs-2 v4
ChartJS.register(LineElement, PointElement, CategoryScale, RadialLinearScale, Legend, Title, Tooltip);


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
  className?: string;
  data: InputData[];
  title: string;
  relToMinAndMax: boolean;
  limits: {[measureName: string]: Limits};
};

type RLTRadarStates = {
};

export class RLTRadar extends React.Component<RLTRadarProps, RLTRadarStates> {
  state = {
  }
  render() {
    return (
      <Radar
      className={`${this.props.className ?? ''}`}
      data={
        {
          labels: this.props.data[0].measures.map(m => (m.name === "deaths") ? `${m.name}*` : m.name),
          datasets: this.props.data.map(d => {
            return {
              label: d.player,
              //data: d.measures.map(m => m.value),
              data: d.measures.map(m => {
                const value = this.props.relToMinAndMax
                              ?
                              // rel to min and max
                              ( m.value - this.props.limits[m.name].min.value ) / ( this.props.limits[m.name].max.value - this.props.limits[m.name].min.value )
                              :
                              // rel to max
                              m.value/this.props.limits[m.name].max.value
                return (m.name === "deaths") ? 1 - value : value
              }),
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

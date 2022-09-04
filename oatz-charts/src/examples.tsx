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

// registration for tree-shakable way to import in react-chartjs-2 v4
ChartJS.register(LineElement, PointElement, CategoryScale, RadialLinearScale, Legend, Title, Tooltip);


type ChartExampleProps = {

};

type ChartExampleStates = {

};

export class ChartExample extends React.Component<ChartExampleProps, ChartExampleStates> {
  state = {

  }
  render() {
    return (
      <Radar
      data={
        {
          labels: [
            'Eating',
            'Drinking',
            'Sleeping',
            'Designing',
            'Coding',
            'Cycling',
            'Running'
          ],
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
        }
      }
      options={
        {
          elements: {
            line: {
              borderWidth: 3
            }
          }
        }
      }
      />
    );
  }
};

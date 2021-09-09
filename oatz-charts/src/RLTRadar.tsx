import React from 'react';
import {Radar} from 'react-chartjs-2';
import {ChartData} from './read-data';
import {getAllPlayerMaxStats} from './analysis';


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
};

type RLTRadarStates = {
  maxes: {[measureName: string]: number};
};

export class RLTRadar extends React.Component<RLTRadarProps, RLTRadarStates> {
  state = {
    maxes: getAllPlayerMaxStats(this.props.allData),
  }
  getPlayerColor(playerName: string): string {
    if ( playerName === "wiesl2" ) { return 'rgb(102, 255, 255)'; }
    else if ( playerName === "Grent" ) { return 'rgb(146, 208, 80)'; }
    else if ( playerName === "Ozumi" ) { return 'rgb(255, 192, 0)'; }
    else if ( playerName === "Bergsalz" ) { return 'rgb(255, 0, 0)'; }
    else if ( playerName === "DaPhysika" ) { return 'rgb(112, 48, 160)'; }
    else {
      return 'rgb(120,120,120)';
    }
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
              data: d.measures.map(m => m.value/this.state.maxes[m.name]),
              fill: false,
              borderColor: this.getPlayerColor(d.player),
              pointBackgroundColor: this.getPlayerColor(d.player),
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
        }
      }
      />
    );
  }
};
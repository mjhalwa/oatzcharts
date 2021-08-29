import React from 'react';
import './App.css';
import {data, ChartData} from './read-data';
import {Radar} from 'react-chartjs-2';

//let arr = [1,2,3];

//const dataItems = Object.keys(data).map((val) => <li>{val}</li>);
const dataItems = data.map((val, index) => <li>{index}: {val.content.name}</li>);

type AppProps = {

};

type AppStates = {

};

class App extends React.Component<AppProps, AppStates> {
  state = {

  }
  render() {
    return (
      <main className="app">
        <h2>Text example</h2>
        <p>hi</p>
        <h2>Chart example</h2> 
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
        <h2>Data Example</h2>
        {Array(data.length).keys()}
        <ul>
          {dataItems}
        </ul>
        <p>there</p>
      </main>
    );
  }
}

export default App;

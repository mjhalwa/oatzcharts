import React from 'react';
import './App.css';
import {ChartExample} from './examples'
import {data} from './read-data';
import {calcStats} from './analysis';
import {RLTRadar} from './RLTRadar';

//let arr = [1,2,3];

//const dataItems = Object.keys(data).map((val) => <li>{val}</li>);
const dataItems = data.map((val, index) => <li>{index}: {val.name}</li>);


let stats = calcStats(data);


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
        <h2>Radar example</h2>
        <RLTRadar 
          data={
            data[0].players.map( p => {
              return {
                player: p.name,
                measures: Object.entries(p.measures).map( ([k, m]) => {return {name: k, value: m.avg.value};} )
              };
            })
          }
          allData={data}
          title={data[0].name}
          />
        <h2>Chart example</h2> 
        <ChartExample />
        <h2>Data Example</h2>
        {Array(data.length).keys()}
        <ul>
          {dataItems}
        </ul>
        <p>there</p>
      </main>
    );
  }
};

export default App;

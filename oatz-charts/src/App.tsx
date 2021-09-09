import React, { SelectHTMLAttributes } from 'react';
import './App.css';
// import {ChartExample} from './examples'
import {data} from './read-data';
// import {calcStats} from './analysis';
import {RLTRadar} from './RLTRadar';

type AppProps = {

};

type AppStates = {
  selectedDayIndex: number;
};

class App extends React.Component<AppProps, AppStates> {
  state = {
    selectedDayIndex: 0 //!< latest day
  }
  // see https://reactjs.org/docs/forms.html#the-select-tag
  handleDaySelectionChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState( {selectedDayIndex: Number(event.target.value)} );
  }
  render() {
    return (
      <main className="app">
        <h1>OATZ Charts</h1>

        <form>
          <label>Datum:</label>
          <select value={this.state.selectedDayIndex} onChange={(event) => {this.handleDaySelectionChange(event);}}>
            {data.map((val,index) => <option value={index} key={val.name}>{val.name.split("-").slice(1).reverse().reduce( (prev,curr) => {return `${prev}.${curr}`}, '').slice(1)}</option> )}
          </select>
        </form>

        <section>
          <h2>Player Comparison Radar</h2>
          <RLTRadar 
            data={
              data[this.state.selectedDayIndex].players.map( p => {
                return {
                  player: p.name,
                  measures: Object.entries(p.measures).map( ([k, m]) => {return {name: k, value: m.avg.value};} )
                };
              })
            }
            allData={data}
            title={data[this.state.selectedDayIndex].name}
            />
        </section>

        <section>
          <h2>Each Player Performance Radar</h2>
        </section>
      </main>
    );
  }
};

export default App;

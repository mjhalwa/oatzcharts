import React, { SelectHTMLAttributes } from 'react';
import './App.css';
// import {ChartExample} from './examples'
import {data as offlineData, ChartData, RawChartData, fromRawData} from './read-data';
// import {calcStats} from './analysis';
import {RLTRadar} from './RLTRadar';

type AppProps = {

};

type AppStates = {
  selectedDayIndex: number;
  isLoaded: boolean;
  data: ChartData[];
  errorMessage: string;
};

class App extends React.Component<AppProps, AppStates> {
  state = {
    selectedDayIndex: 0, //!< latest day
    isLoaded: false,
    data: offlineData,
    errorMessage: ""
  }
  componentDidMount() {
    fetch('https://www.oatz.net/rocketleague/api/all')
      .then(res => { return res.json(); })
      .then(
        (result: RawChartData[]) => {
          console.log(result);
          try {
            this.setState({
              isLoaded: true,
              data: fromRawData(result),
              errorMessage: ""
            });
          } catch (err) {
            this.setState({
              isLoaded: false,
              data: offlineData,
              errorMessage: "Fehler bei Datenkonvertierung"
            });
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error: Error) => {
          this.setState({
            isLoaded: false,
            data: offlineData,
            errorMessage: "Server antwortet nicht"
          });
        }
      )
  }
  // see https://reactjs.org/docs/forms.html#the-select-tag
  handleDaySelectionChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState( {selectedDayIndex: Number(event.target.value)} );
  }
  render() {
    return (
      <main className="app">
        { !this.state.isLoaded && <div className="error">verwende offline Daten ({this.state.errorMessage})</div> }
        <h1>[OATZ] Charts</h1>

        <form>
          <label>Datum:</label>
          <select value={this.state.selectedDayIndex} onChange={(event) => {this.handleDaySelectionChange(event);}}>
            {this.state.data.map((val,index) => <option value={index} key={val.name}>{val.name.split("-").slice(1).reverse().reduce( (prev,curr) => {return `${prev}.${curr}`}, '').slice(1)}</option> )}
          </select>
        </form>

        <section>
          <h2>Player Comparison Radar</h2>
          <RLTRadar 
            data={
              this.state.data[this.state.selectedDayIndex].players.map( p => {
                return {
                  player: p.name,
                  measures: Object.entries(p.measures).map( ([k, m]) => {return {name: k, value: m.avg.value};} )
                };
              })
            }
            allData={this.state.data}
            title={this.state.data[this.state.selectedDayIndex].name}
            />
        </section>

        <section>
          <h2>Each Player Performance Radar</h2>
          <p>todo</p>
        </section>
      </main>
    );
  }
};

export default App;

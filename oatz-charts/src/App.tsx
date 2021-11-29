import React, { SelectHTMLAttributes } from 'react';
import './App.css';
// import {ChartExample} from './examples'
import {data as offlineData, ChartData, RawChartData, fromRawData, data} from './read-data';
// import {calcStats} from './analysis';
import {RLTRadar} from './RLTRadar';

// see https://stackoverflow.com/questions/35469836/detecting-production-vs-development-react-at-runtime
// > If you are using create-react-app, process.env.NODE_ENV will be "development" in development mode.
let tempDomain = 'https://www.oatz.net';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  tempDomain = 'http://localhost:9837';
}
const domain = tempDomain;

type AppProps = {

};

type AppStates = {
  selectedDayIndex: number;
  loading: boolean;
  data: ChartData[];
  errorMessage: string;
  PlayerComparison_withMinAndMax: boolean;
};

class App extends React.Component<AppProps, AppStates> {
  state = {
    selectedDayIndex: 0, //!< latest day
    loading: true,
    data: offlineData,
    errorMessage: "",
    PlayerComparison_withMinAndMax: true
  }
  componentDidMount() {
    fetch(`${domain}/rocketleague/api/all`)
      .then(res => { return res.json(); })
      .then(
        (result: RawChartData[]) => {
          try {
            this.setState({
              loading: false,
              data: [...fromRawData(result)],
              errorMessage: ""
            });
          } catch (err) {
            this.setState({
              loading: false,
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
            loading: false,
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
  handlePlayerComparison_withMinAndMax_InputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({PlayerComparison_withMinAndMax: event.target.checked})
  }
  render() {
    if (this.state.loading) {
      return (
        <main className="app">
          <div className="warning">Lade Daten vom Server...</div>
        </main>
      );
    } else {
      return (
        <main className="app">
          { (this.state.errorMessage !== "") && <div className="error">verwende offline Daten ({this.state.errorMessage})</div> }
          <h1>[OATZ] Charts</h1>


          <section>
            <h2>Day Performance</h2>

            <form>
              <label>Datum:</label>
              <select value={this.state.selectedDayIndex} onChange={(event) => {this.handleDaySelectionChange(event);}}>
                { this.state.data.map((val,index) => <option value={index} key={val.name}>{val.name.split("-").slice(1).reverse().reduce( (prev,curr) => {return `${prev}.${curr}`}, '').slice(1)}</option> )}
              </select>
            </form>

            <section>
              <h3>Player Comparison Radar</h3>
              <label>
                relativ zu  min UND max (sonst nur max)
                <input
                  name="withMinAndMax"
                  type="checkbox"
                  checked={this.state.PlayerComparison_withMinAndMax}
                  onChange={(event) => {this.handlePlayerComparison_withMinAndMax_InputChange(event);}}
                />
              </label>
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
                relToMinAndMax={this.state.PlayerComparison_withMinAndMax}
                />
            </section>

            <section>
              <h3>Each Player Performance Radar</h3>
              <p>todo</p>
            </section>

            <section>
              <h3>Werteverteilung</h3>
              <p>todo</p>
            </section>

          </section>

          <section>
            <h2>Total</h2>

            <section>
              <h3>Longterm Development</h3>
              <p>todo</p>
            </section>

          </section>
        </main>
      );
    }
  }
};

export default App;

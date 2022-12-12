import {Component, useEffect} from 'react';
import './Superpowered';
import logo from './logo.svg';
import './App.css';

const publicSuperpoweredLocation = '/Superpowered.js'

class App extends Component {

  constructor(props) {
    super(props);
    this.loadSP();
  }

  onMessageFromMainScope(message) {

  }

  async loadSP () {
    // eslint-disable-next-line
    const superpowered = await SuperpoweredGlue.Instantiate(
      "ExampleLicenseKey-WillExpire-OnNextUpdate",
      publicSuperpoweredLocation
      );
      console.log(`Running Superpowered v${superpowered.Version()}`);
    // eslint-disable-next-line
    this.webaudioManager = new SuperpoweredWebAudio(
      48000,
      superpowered
    );

    // Now create the AudioWorkletNode, passing in the AudioWorkletProcessor url, it's registered name (defined inside the processor) and a callback then gets called when everything is up a ready
    this.processorNode = await this.webaudioManager.createAudioNodeAsync(
      "/processorScripts/toneProcessor.js",
      "SuperpoweredSingleGeneratorStageProcessor",
      this.onMessageProcessorAudioScope.bind(this)
    );
    this.processorNode.connect(this.webaudioManager.audioContext.destination);
    this.processorNode.onprocessorerror = (e) => {
      console.error(e);
    };

  }

  onMessageProcessorAudioScope(message) {
    console.log(message);
  }

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <img src="/superpowered.svg" className="App-superpowered-logo" alt="Superpowered Logo" />
        <img src={logo} className="App-logo" alt="logo" />
        <button className="App-start-button" onClick={()=>this.webaudioManager.audioContext.resume()}>Start Tone</button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
    }
}

export default App;

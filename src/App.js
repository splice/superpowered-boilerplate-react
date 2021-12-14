import {printMsg} from 'superpowered-audio';
import {Component, useEffect} from 'react';
import {SuperpoweredGlue, SuperpoweredWebAudio, SuperpoweredTrackLoader} from 'superpowered-audio';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.loadSP();
  }

  onMessageFromMainScope(message) {
   
  }

  async loadSP () {
    const superpowered = await SuperpoweredGlue.fetch('/superpowered/superpowered.wasm');
    superpowered.Initialize({
      licenseKey: "ExampleLicenseKey-WillExpire-OnNextUpdate",
      enableAudioAnalysis: true,
      enableFFTAndFrequencyDomain: true,
      enableAudioTimeStretching: true,
      enableAudioEffects: true,
      enableAudioPlayerAndDecoder: true,
      enableCryptographics: false,
      enableNetworking: false
    });
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

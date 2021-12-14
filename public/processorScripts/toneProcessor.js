import { SuperpoweredWebAudio } from '../superpowered/SuperpoweredWebAudio.js';


class SuperpoweredSingleGeneratorStageProcessor extends SuperpoweredWebAudio.AudioWorkletProcessor {
  // runs after the constructor
  onReady() {
      this.generator = new this.Superpowered.Generator(
          this.samplerate,                      // The initial sample rate in Hz.
          this.Superpowered.Generator.Sine // The initial shape.
      );
      this.generator.frequency = 440;

      // Create an empty buffer o store the ouput of the mono generator. 2048 is the largest buffer size we'll need to deal with
      this.genOutputBuffer = new this.Superpowered.Float32Buffer(4096);

      this.sendMessageToMainScope({ event: 'ready' });
  }

  onDestruct() {
      this.generator.destruct();
  }

  processAudio(inputBuffer, outputBuffer, buffersize, parameters) {
      this.generator.generate(
          this.genOutputBuffer.pointer, // output, // Pointer to floating point numbers. 32-bit MONO output.
          buffersize   // number of samples to generae
      );

      // We now need to convert the mono signal from the generaor into he interleaved stereo format that the parent audio context requires.
      this.Superpowered.Interleave(
          this.genOutputBuffer.pointer, // left mono input
          this.genOutputBuffer.pointer, // right mono input
          outputBuffer.pointer, // stereo output - this is what is routed to the AudioWorkletProcessor output
          buffersize // number of frames
      );
  }
}

// The following code registers the processor script in the browser, notice the label and reference
if (typeof AudioWorkletProcessor === "function")
  registerProcessor("SuperpoweredSingleGeneratorStageProcessor", SuperpoweredSingleGeneratorStageProcessor);
export default SuperpoweredSingleGeneratorStageProcessor;

class AudioService {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.filterNode = null;
    this.oscillators = [];
  }

  initialize() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 2000;
    this.filterNode.Q.value = 1;

    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  stopCurrentSound() {
    if (this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
    }

    this.oscillators.forEach(osc => {
      try {
        osc.stop(this.audioContext.currentTime + 0.05);
        osc.disconnect();
      } catch (e) {
        // Ignoriere Fehler beim Stoppen
      }
    });
    this.oscillators = [];
  }

  createTrumpetSound(frequency) {
    if (!this.audioContext) return;

    this.stopCurrentSound();

    const now = this.audioContext.currentTime;

    // Grundton
    const fundamental = this.audioContext.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, now);

    // Erste Harmonische
    const harmonic1 = this.audioContext.createOscillator();
    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(frequency * 2, now);

    // Zweite Harmonische
    const harmonic2 = this.audioContext.createOscillator();
    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 3, now);

    // Gain Nodes für die Harmonischen
    const fundamentalGain = this.audioContext.createGain();
    const harmonic1Gain = this.audioContext.createGain();
    const harmonic2Gain = this.audioContext.createGain();

    fundamentalGain.gain.value = 0.5;
    harmonic1Gain.gain.value = 0.3;
    harmonic2Gain.gain.value = 0.2;

    // Verbindungen
    fundamental.connect(fundamentalGain);
    harmonic1.connect(harmonic1Gain);
    harmonic2.connect(harmonic2Gain);

    fundamentalGain.connect(this.filterNode);
    harmonic1Gain.connect(this.filterNode);
    harmonic2Gain.connect(this.filterNode);

    // Hüllkurve
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);

    // Oszillatoren starten
    fundamental.start(now);
    harmonic1.start(now);
    harmonic2.start(now);

    this.oscillators = [fundamental, harmonic1, harmonic2];
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  cleanup() {
    if (this.audioContext) {
      this.stopCurrentSound();
      this.audioContext.close();
    }
  }
}

export default new AudioService();

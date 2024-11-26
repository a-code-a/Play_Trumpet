import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Grifftabelle für die B-Trompete
const FINGERING_TABLE = {
  'offen': 'C',
  '2': 'H',
  '1': 'F',
  '1+2': 'E',
  '1+3': 'D',
  '2+3': 'Eb/D#',
  '1+2+3': 'Db/C#',
};

// Frequenztabelle für die Töne (in Hz)
const NOTE_FREQUENCIES = {
  'C': 261.63,  // C4
  'H': 246.94,  // B3
  'F': 349.23,  // F4
  'E': 329.63,  // E4
  'D': 293.66,  // D4
  'Eb/D#': 311.13, // Eb4
  'Db/C#': 277.18, // C#4
};

function App() {
  const [octave, setOctave] = useState(4);
  const [valves, setValves] = useState({
    valve1: false,
    valve2: false,
    valve3: false
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);
  const filterRef = useRef(null);

  // Audio Context initialisieren
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = 0;

    filterRef.current = audioContextRef.current.createBiquadFilter();
    filterRef.current.type = 'lowpass';
    filterRef.current.frequency.value = 2000;
    filterRef.current.Q.value = 1;

    filterRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Tastatursteuerung
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['1', '2', '3'].includes(event.key) && !event.repeat) {
        const valveNumber = parseInt(event.key);
        setValves(prev => ({
          ...prev,
          [`valve${valveNumber}`]: true
        }));
      }
    };

    const handleKeyUp = (event) => {
      if (['1', '2', '3'].includes(event.key)) {
        const valveNumber = parseInt(event.key);
        setValves(prev => ({
          ...prev,
          [`valve${valveNumber}`]: false
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getValveCombination = () => {
    const pressedValves = Object.entries(valves)
      .filter(([_, isPressed]) => isPressed)
      .map(([valve]) => valve.replace('valve', ''))
      .sort()
      .join('+');
    
    return pressedValves || 'offen';
  };

  const getPlayedTone = () => {
    const combination = getValveCombination();
    const baseTone = FINGERING_TABLE[combination] || '-';
    return baseTone !== '-' ? `${baseTone}${octave}` : '-';
  };

  const stopCurrentSound = () => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.05);
    }

    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop(audioContextRef.current.currentTime + 0.05);
        osc.disconnect();
      } catch (e) {
        // Ignoriere Fehler beim Stoppen
      }
    });
    oscillatorsRef.current = [];
  };

  const createTrumpetSound = (frequency) => {
    if (!audioContextRef.current || !isPlaying) return;

    stopCurrentSound();

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Grundton
    const fundamental = ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, now);

    // Erste Harmonische
    const harmonic1 = ctx.createOscillator();
    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(frequency * 2, now);

    // Zweite Harmonische
    const harmonic2 = ctx.createOscillator();
    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 3, now);

    // Gain Nodes für die Harmonischen
    const fundamentalGain = ctx.createGain();
    const harmonic1Gain = ctx.createGain();
    const harmonic2Gain = ctx.createGain();

    fundamentalGain.gain.value = 0.5;
    harmonic1Gain.gain.value = 0.3;
    harmonic2Gain.gain.value = 0.2;

    // Verbindungen
    fundamental.connect(fundamentalGain);
    harmonic1.connect(harmonic1Gain);
    harmonic2.connect(harmonic2Gain);

    fundamentalGain.connect(filterRef.current);
    harmonic1Gain.connect(filterRef.current);
    harmonic2Gain.connect(filterRef.current);

    // Hüllkurve
    gainNodeRef.current.gain.cancelScheduledValues(now);
    gainNodeRef.current.gain.setValueAtTime(0, now);
    gainNodeRef.current.gain.linearRampToValueAtTime(0.15, now + 0.05);

    // Oszillatoren starten
    fundamental.start(now);
    harmonic1.start(now);
    harmonic2.start(now);

    oscillatorsRef.current = [fundamental, harmonic1, harmonic2];
  };

  // Effekt zum Abspielen des Tons bei Ventilkombinationsänderungen
  useEffect(() => {
    const combination = getValveCombination();
    const baseTone = FINGERING_TABLE[combination];
    
    if (baseTone && NOTE_FREQUENCIES[baseTone]) {
      const octaveMultiplier = Math.pow(2, octave - 4);
      const frequency = NOTE_FREQUENCIES[baseTone] * octaveMultiplier;
      createTrumpetSound(frequency);
    }
  }, [valves, octave, isPlaying]);

  const togglePlay = () => {
    if (!isPlaying) {
      // Starte Audio Context wenn noch nicht gestartet
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      setIsPlaying(true);
    } else {
      stopCurrentSound();
      setIsPlaying(false);
    }
  };

  return (
    <div className="App">
      <h1>B-Trompete Grifftabelle</h1>
      
      <div className="tone-display">
        <h2>Aktueller Ton: {getPlayedTone()}</h2>
      </div>

      <div className="valves-section">
        <button className={`valve-button ${valves.valve1 ? 'pressed' : ''}`}>1</button>
        <button className={`valve-button ${valves.valve2 ? 'pressed' : ''}`}>2</button>
        <button className={`valve-button ${valves.valve3 ? 'pressed' : ''}`}>3</button>
      </div>

      <div className="octave-control">
        <label>Oktave: {octave}</label>
        <input
          type="range"
          min="1"
          max="7"
          value={octave}
          onChange={(e) => setOctave(parseInt(e.target.value))}
        />
      </div>

      <div className="play-control">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`} 
          onClick={togglePlay}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}

export default App;

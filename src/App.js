import React, { useState, useEffect } from 'react';
import './App.css';
import Score from './components/Score';
import Controls from './components/Controls';
import AudioService from './services/AudioService';
import { useValves } from './hooks/useValves';
import { SONG } from './constants/notes';

function App() {
  const [octave, setOctave] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);
  
  const { valves, getValveCombination } = useValves();

  // Audio Context initialisieren
  useEffect(() => {
    AudioService.initialize();
    return () => AudioService.cleanup();
  }, []);

  // Effekt zum Überprüfen der Ventilkombination und Fortschreiten im Stück
  useEffect(() => {
    const combination = getValveCombination();
    const currentNote = SONG[currentNoteIndex];
    const now = Date.now();
    
    if (combination === currentNote.combination && now - lastCorrectTime > 500) {
      if (isPlaying) {
        const octaveMultiplier = Math.pow(2, octave - 4);
        const frequency = currentNote.frequency * octaveMultiplier;
        AudioService.createTrumpetSound(frequency);
      }
      
      setTimeout(() => {
        setCurrentNoteIndex((prev) => (prev + 1) % SONG.length);
        setLastCorrectTime(now);
      }, 500);
    }
  }, [valves, octave, isPlaying, currentNoteIndex, lastCorrectTime, getValveCombination]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      AudioService.resume();
      setIsPlaying(true);
      setCurrentNoteIndex(0);
    } else {
      AudioService.stopCurrentSound();
      setIsPlaying(false);
    }
  };

  const handleOctaveChange = (newOctave) => {
    setOctave(newOctave);
  };

  return (
    <div className="App">
      <h1>B-Trompete</h1>
      
      <Score 
        currentNoteIndex={currentNoteIndex}
        isPlaying={isPlaying}
      />

      <Controls 
        valves={valves}
        currentNoteIndex={currentNoteIndex}
        octave={octave}
        isPlaying={isPlaying}
        onOctaveChange={handleOctaveChange}
        onPlayToggle={handlePlayToggle}
      />
    </div>
  );
}

export default App;

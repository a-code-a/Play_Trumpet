import React, { useState, useEffect } from 'react';
import './App.css';
import Score from './components/Score';
import Controls from './components/Controls';
import AudioService from './services/AudioService';
import { useValves } from './hooks/useValves';
import { SCALES } from './constants/notes';

function App() {
  const [octave, setOctave] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);
  const [currentScale, setCurrentScale] = useState('C-Dur');
  
  const { valves, getValveCombination } = useValves();

  // Aktuelle Tonleiter
  const currentNotes = SCALES[currentScale];
  const currentNote = currentNotes[currentNoteIndex];

  // Audio Context initialisieren
  useEffect(() => {
    AudioService.initialize();
    return () => AudioService.cleanup();
  }, []);

  // Effekt zum Überprüfen der Ventilkombination und Fortschreiten in der Tonleiter
  useEffect(() => {
    const combination = getValveCombination();
    const now = Date.now();
    
    if (combination === currentNote.combination && now - lastCorrectTime > 500) {
      if (isPlaying) {
        const octaveMultiplier = Math.pow(2, octave - 4);
        const frequency = currentNote.frequency * octaveMultiplier;
        AudioService.createTrumpetSound(frequency);
      }
      
      setTimeout(() => {
        setCurrentNoteIndex((prev) => (prev + 1) % currentNotes.length);
        setLastCorrectTime(now);
      }, 500);
    }
  }, [valves, octave, isPlaying, currentNoteIndex, lastCorrectTime, getValveCombination, currentNote, currentNotes.length]);

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

  const handleScaleChange = (newScale) => {
    setCurrentScale(newScale);
    setCurrentNoteIndex(0);
    if (isPlaying) {
      handlePlayToggle(); // Stoppt das Spielen bei Tonleiterwechsel
    }
  };

  return (
    <div className="App">
      <h1>B-Trompete: Tonleitern</h1>
      
      <Score 
        notes={currentNotes}
        currentNoteIndex={currentNoteIndex}
        isPlaying={isPlaying}
      />

      <Controls 
        valves={valves}
        currentNoteIndex={currentNoteIndex}
        currentScale={currentScale}
        currentNote={currentNote}
        octave={octave}
        isPlaying={isPlaying}
        onScaleChange={handleScaleChange}
        onOctaveChange={handleOctaveChange}
        onPlayToggle={handlePlayToggle}
      />
    </div>
  );
}

export default App;

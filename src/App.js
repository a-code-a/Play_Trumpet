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
  const [currentScale, setCurrentScale] = useState('C-Dur');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Erweiterte Tastenbelegung
  const { 
    valves, 
    getValveCombination, 
    updateKeyMap 
  } = useValves({
    valve1: ['1', 'q', 'a'],
    valve2: ['2', 'w', 's'],
    valve3: ['3', 'e', 'd']
  });

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
    
    // Nur zur nächsten Note wechseln, wenn EXAKT die richtige Kombination gedrückt wird
    if (combination === currentNote.combination) {
      if (isPlaying) {
        const octaveMultiplier = Math.pow(2, octave - 4);
        const frequency = currentNote.frequency * octaveMultiplier;
        AudioService.createTrumpetSound(frequency);
      }
      
      // Direkt zur nächsten Note wechseln
      setCurrentNoteIndex((prev) => (prev + 1) % currentNotes.length);
    }
  }, [valves, octave, isPlaying, currentNoteIndex, getValveCombination, currentNote, currentNotes.length]);

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

  // Funktion zum Ändern der Tastenbelegung
  const handleKeyMapChange = (newKeyMap) => {
    updateKeyMap(newKeyMap);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="App">
      <button 
        className={`toggle-sidebar-btn ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}
        onClick={toggleSidebar}
      >
        {isSidebarVisible ? '→' : '←'}
      </button>

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
        onKeyMapChange={handleKeyMapChange}
        className={`sidebar ${!isSidebarVisible ? 'hidden' : ''}`}
      />
    </div>
  );
}

export default App;
